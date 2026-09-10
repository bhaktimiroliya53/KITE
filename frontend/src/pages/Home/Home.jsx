import { useState, useEffect, useRef } from "react";
import logo from "../../assets/logo/kite-brand-logo.png";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { FiBookmark } from "react-icons/fi";
import { BsBookmarkFill } from "react-icons/bs";
import { FaHeart, FaRegHeart, FaRegComment } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import Rightbar from "../../components/user/Rightbar/Rightbar";
import Sidebar from "../../components/user/Sidebar/Sidebar";
import Topbar from "../../components/user/Topbar/Topbar";
import "../../styles/user/home.css";
import "../../styles/user/feed.css";
import "../../styles/user/createpost.css";
import "../../styles/user/postcard.css";
import { FiRepeat } from "react-icons/fi";
import { FaPlay, FaPause } from "react-icons/fa";


function Home() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [commentText, setCommentText] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [deletingPostId, setDeletingPostId] = useState(null);
  const [showLikes, setShowLikes] = useState(null);
  const [animatingPost, setAnimatingPost] = useState(null);
  const [showReposts, setShowReposts] = useState(null);
  const [likedAnimation, setLikedAnimation] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showCommentEmoji, setShowCommentEmoji] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [heartPosition, setHeartPosition] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyImage, setReplyImage] = useState(null);
  const [replyPreview, setReplyPreview] = useState("");
  const [expandedReplies, setExpandedReplies] = useState({});
  const [commentMenuOpen, setCommentMenuOpen] = useState(null);
  const [shareComment, setShareComment] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [commentRepostAnimation, setCommentRepostAnimation] = useState(null);
  const [viewImage, setViewImage] = useState(null);
  const imageClickTimer = useRef(null);
  const [playingPostId, setPlayingPostId] = useState(null);
  const audioRef = useRef(null);

  const emojiRef = useRef(null);

  const handleMusicToggle = async (post) => {
    if (!post.music?.previewUrl) return;

    try {
      // Stop currently playing song
      if (
        playingPostId === post._id &&
        audioRef.current
      ) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setPlayingPostId(null);
        return;
      }

      // Stop previous song
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const audio = new Audio(post.music.previewUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setPlayingPostId(null);
        audioRef.current = null;
      };

      setPlayingPostId(post._id);

      await audio.play();
    } catch (error) {
      console.error("MUSIC PLAY ERROR =>", error);
      setPlayingPostId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";

    setTheme(newTheme);

    localStorage.setItem("theme", newTheme);

    document.body.setAttribute("data-theme", newTheme);
  };

  const fetchPosts = async () => {
    try {
      const currentUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const res = await API.get("/posts", {
        params: {
          userId: currentUser?._id,
        },
      });

      setPosts(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const handleUploadProgress = (event) => {
      setUploadProgress(event.detail);

      if (event.detail.status === "complete") {
        fetchPosts();
      }
    };

    window.addEventListener(
      "kite-upload-progress",
      handleUploadProgress
    );

    return () => {
      window.removeEventListener(
        "kite-upload-progress",
        handleUploadProgress
      );
    };
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setAllUsers(res.data);
    } catch (error) {
      console.log("USERS ERROR =>", error);
    }
  };

  const shareCommentToUser = async (shareUser) => {

    try {

      const currentUser = JSON.parse(
        localStorage.getItem("user")
      );


      await API.post("/messages/share-comment", {

        senderId: currentUser._id,

        receiverId: shareUser._id,

        comment: {
          username: shareComment.username,
          avatar: shareComment.avatar,
          text: shareComment.text
        }

      });


      alert("Comment shared ✅");

      setShareComment(null);


    } catch (error) {

      console.log(
        "SHARE COMMENT ERROR =>",
        error
      );

    }

  };



  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmoji(false);
        setShowCommentEmoji(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePost = async () => {
    console.log("POST CLICKED");

    try {
      if (!content.trim() && !selectedImage) {
        alert("Add caption or image!");
        return;
      }

      setIsPosting(true);
      console.log("isPosting set to true");

      const user = JSON.parse(localStorage.getItem("user"));

      let imageUrl = "";

      if (selectedImage) {
        const formData = new FormData();

        formData.append("file", selectedImage);
        formData.append("upload_preset", "kite_upload");

        const cloudRes = await fetch(
          "https://api.cloudinary.com/v1_1/kiteapp/image/upload",
          {
            method: "POST",
            body: formData,
          },
        );

        const cloudData = await cloudRes.json();

        imageUrl = cloudData.secure_url;
      }

      await API.post("/posts", {
        content,
        image: imageUrl,
        userId: user._id,
      });

      await fetchPosts();

      setContent("");
      setImagePreview("");
      setSelectedImage(null);
      setShowModal(false);
    } catch (error) {
      console.log("POST ERROR =>", error);
    } finally {
      console.log("isPostindg set to false");

      setIsPosting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedImage(file);

    setImagePreview(URL.createObjectURL(file));
  };

  const handleDelete = async (id) => {
    console.log("DELETE ID =", id);

    try {
      setDeletingPostId(id);

      await API.delete(`/posts/${id}`);

      await new Promise((resolve) => setTimeout(resolve, 700));

      setMenuOpen(null);
      fetchPosts();
    } catch (error) {
      console.log("DELETE POST ERROR =>", error);
      setMenuOpen(null);
    } finally {
      setDeletingPostId(null);
    }
  };

  const handleCopyLink = async (postId) => {
    try {
      const link = `${window.location.origin}/post/${postId}`;

      await navigator.clipboard.writeText(link);

      setMenuOpen(null);
      alert("Post link copied!");
    } catch (error) {
      console.log("COPY LINK ERROR =>", error);
    }
  };

  const handleLike = async (id) => {
    const currentUser = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    if (!currentUser?._id) return;

    // INSTANT UI UPDATE
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post._id !== id) return post;

        const alreadyLiked = post.likes?.some(
          (likeUser) =>
            likeUser?._id === currentUser._id ||
            likeUser === currentUser._id
        );

        return {
          ...post,
          likes: alreadyLiked
            ? post.likes.filter(
              (likeUser) =>
                likeUser?._id !== currentUser._id &&
                likeUser !== currentUser._id
            )
            : [
              ...(post.likes || []),
              currentUser,
            ],
        };
      })
    );

    // BACKGROUND API CALL
    try {
      await API.put(`/posts/like/${id}`, {
        userId: currentUser._id,
      });
    } catch (error) {
      console.log("LIKE ERROR =", error);

      // API fail thay to UI rollback
      fetchPosts();
    }
  };

  const handleRepost = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      await API.put(`/posts/repost/${id}`, {
        userId: user._id,
      });

      fetchPosts();
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      await API.put(`/posts/comment/${selectedPost._id}`, {
        userId: user._id,
        username: user.username,
        avatar: user.avatar,
        text: commentText,
      });

      setCommentText("");
      setSelectedPost(null);

      fetchPosts();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setShowModal(false);

    setContent("");

    setImagePreview("");

    setSelectedImage(null);
  };

  const handleSave = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      await API.put(`/posts/save/${id}`, {
        userId: user._id,
      });

      fetchPosts();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDoubleLike = (postId, e) => {
    // Every double click → animation
    const rect = e.currentTarget.getBoundingClientRect();

    setHeartPosition({
      postId,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      id: Date.now(),
    });

    // Animation clear
    setTimeout(() => {
      setHeartPosition(null);
    }, 800);

    // Check whether current user already liked this post
    const post = posts.find((p) => p._id === postId);

    const alreadyLiked = post?.likes?.some(
      (likeUser) =>
        likeUser._id === user?._id ||
        likeUser === user?._id
    );

    // IMPORTANT:
    // Only call API if user has NOT already liked
    if (!alreadyLiked) {
      handleLike(postId);
    }
  };

  const handleReplyImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setReplyImage(file);
    setReplyPreview(URL.createObjectURL(file));
  };

  const handleReply = async (commentIndex) => {

    try {
      if (!replyText.trim() && !replyImage) return;

      const currentUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      let imageUrl = "";

      if (replyImage) {
        const formData = new FormData();

        formData.append("file", replyImage);
        formData.append("upload_preset", "kite_upload");

        const cloudRes = await fetch(
          "https://api.cloudinary.com/v1_1/kiteapp/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const cloudData = await cloudRes.json();
        imageUrl = cloudData.secure_url || "";
      }

      await API.put(
        `/posts/reply/${selectedPost._id}/${commentIndex}`,
        {
          userId: currentUser._id,
          avatar: currentUser.avatar || "",
          text: replyText,
          image: imageUrl,
        }
      );

      setReplyText("");
      setReplyImage(null);
      setReplyPreview("");
      setReplyingTo(null);

      const res = await API.get("/posts");

      setPosts(res.data);

      const updatedPost = res.data.find(
        (p) => p._id === selectedPost._id
      );

      setSelectedPost(updatedPost);
    } catch (error) {
      console.log("REPLY ERROR =>", error);
    }
  };

  const handleCommentRepost = async (commentIndex) => {
    try {
      const currentUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      await API.put(
        `/posts/comment-repost/${selectedPost._id}/${commentIndex}`,
        {
          userId: currentUser._id,
        }
      );

      const res = await API.get("/posts");

      setPosts(res.data);

      const updatedPost = res.data.find(
        (p) => p._id === selectedPost._id
      );

      setSelectedPost(updatedPost);

      setCommentMenuOpen(null);

    } catch (error) {
      console.log("COMMENT REPOST ERROR =>", error);
    }
  };


  const toggleReplies = (commentIndex) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentIndex]: !prev[commentIndex],
    }));
  };

  return (
    <div className="home-page">

      <Sidebar onLogout={handleLogout} />

      <div className="main-content">
        <Topbar user={user} />

        <div className="content-columns">
          {/* FEED */}

          <main className="feed">

            {uploadProgress &&
              uploadProgress.status !== "hidden" &&
              uploadProgress.status !== "complete" &&
              uploadProgress.status !== "error" && (
                <div className="kite-upload-progress">
                  <div
                    className="kite-upload-progress-bar"
                    style={{
                      width: `${uploadProgress.progress || 0}%`,
                    }}
                  />
                </div>
              )}

            {/* CREATE POST */}

            <div className="create-post">
              <img
                className="create-post-avatar"
                src={user?.avatar || "https://i.pravatar.cc/150"}
                alt="profile"
              />

              <div
                className="create-post-input"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowModal(true);
                }}
              >
                <span>
                  What's on your mind, {user?.name || "User"}?
                </span>
              </div>

              <button
                type="button"
                className="create-post-btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowModal(true);
                }}
              >
                Create
              </button>
            </div>



            {isPosting && (
              <div className="posting-overlay">
                <div className="posting-loader-card">
                  <div className="posting-spinner"></div>

                  <h3>Creating your post...</h3>

                  <p>Please wait a moment</p>
                </div>
              </div>
            )}
            {/* DYNAMIC POSTS */}

            {posts.map((post) => {



              const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

              const isSaved =
                currentUser?._id && post.savedBy?.includes(currentUser._id);

              const isReposted =
                currentUser?._id &&
                post.reposts?.some(
                  (repostUser) =>
                    repostUser?._id === currentUser._id ||
                    repostUser === currentUser._id
                );
              const isAnimating = animatingPost === post._id;

              return (
                <div className="post-card" key={post._id}>
                  <div className="post-top">

                    <div className="post-user">

                      <img
                        className="post-avatar"
                        src={
                          post.userId?.avatar ||
                          post.profilePic ||
                          "https://i.pravatar.cc/150"
                        }
                        alt="profile"
                      />


                      <div className="post-user-info">

                        <div className="post-name-row">

                          <h4>
                            {post.userId?.username ||
                              post.username ||
                              "KITE User"}
                          </h4>


                          {/* FUTURE VERIFIED BADGE */}
                          <span className="verified-badge">
                            ✓
                          </span>

                        </div>


                        <div className="post-meta">

                          <span>
                            @{post.userId?.username ||
                              post.username ||
                              "user"}
                          </span>

                          <span>•</span>

                          <span>
                            {(() => {
                              const createdAt = new Date(post.createdAt);
                              const now = new Date();
                              const diffMs = now - createdAt;

                              const seconds = Math.floor(diffMs / 1000);
                              const minutes = Math.floor(seconds / 60);
                              const hours = Math.floor(minutes / 60);
                              const days = Math.floor(hours / 24);

                              if (seconds < 60) return "Just now";
                              if (minutes < 60) return `${minutes}m ago`;
                              if (hours < 24) return `${hours}h ago`;
                              if (days < 7) return `${days}d ago`;

                              return createdAt.toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                              });
                            })()}
                          </span>

                          {(post.location?.name || post.location?.address) && (
                            <>
                              <span>•</span>
                              <span className="post-location">
                                📍 {post.location.name || post.location.address}
                              </span>
                            </>
                          )}

                        </div>

                      </div>

                    </div>


                    <button
                      className="post-more-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(
                          menuOpen === post._id
                            ? null
                            : post._id
                        );
                      }}
                    >
                      ⋯
                    </button>

                  </div>

                  {post.music?.previewUrl && (
                    <div className="post-music">
                      <button
                        type="button"
                        className="post-music-play"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMusicToggle(post);
                        }}
                      >
                        {playingPostId === post._id ? (
                          <FaPause />
                        ) : (
                          <FaPlay />
                        )}
                      </button>

                      <div className="post-music-info">
                        <div className="post-music-title">
                          {post.music.title || "Unknown song"}
                        </div>

                        <div className="post-music-artist">
                          {post.music.artist || "Unknown artist"}
                        </div>
                      </div>

                      <div
                        className={`music-waves ${playingPostId === post._id ? "music-waves-playing" : ""
                          }`}
                      >
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>

                      {post.music.artwork && (
                        <img
                          src={post.music.artwork}
                          alt=""
                          className="post-music-artwork"
                        />
                      )}
                    </div>
                  )}

                  <div className="post-content">
                    <p>{post.content}</p>
                  </div>

                  {post.image && (
                    <div
                      className="image-wrapper"
                      onClick={(e) => {
                        e.stopPropagation();

                        imageClickTimer.current = setTimeout(() => {
                          setViewImage(post.image);
                        }, 220);
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();

                        if (imageClickTimer.current) {
                          clearTimeout(imageClickTimer.current);
                        }

                        handleDoubleLike(post._id, e);
                      }}
                    >
                      <img
                        src={post.image}
                        alt=""
                        className="post-image"
                      />

                      {heartPosition?.postId === post._id && (
                        <div
                          className="heart-animation"
                          style={{
                            left: heartPosition.x,
                            top: heartPosition.y,
                          }}
                        >
                          ❤️
                        </div>
                      )}
                    </div>
                  )}

                  <div className="post-actions">
                    <div className="action-item">
                      <button
                        className={`action-btn ${post.likes?.some(
                          (likeUser) =>
                            likeUser?._id === user?._id ||
                            likeUser === user?._id
                        )
                          ? "liked"
                          : ""
                          }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(post._id);
                        }}
                      >
                        {post.likes?.some(
                          (likeUser) =>
                            likeUser._id === user?._id || likeUser === user?._id
                        ) ? (
                          <FaHeart />
                        ) : (
                          <FaRegHeart />
                        )}
                      </button>

                      <span
                        className="action-count"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowLikes(post);
                        }}
                      >
                        {post.likes?.length || 0}
                      </span>
                    </div>

                    <div className="action-item">
                      <button
                        className="action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("COMMENT CLICKED", post._id);
                          setSelectedPost(post);
                        }}
                      >
                        <FaRegComment />
                      </button>

                      <span className="action-count">
                        {post.comments?.length || 0}
                      </span>
                    </div>

                    <div className="action-item">
                      <button
                        className={`action-btn ${isAnimating ? "repost-active" : ""
                          }`}
                        style={{
                          color: isReposted ? "#22c55e" : "white",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();

                          setAnimatingPost(post._id);

                          handleRepost(post._id);

                          setTimeout(() => {
                            setAnimatingPost(null);
                          }, 350);
                        }}
                      >
                        <FiRepeat />
                      </button>

                      <span
                        className="action-count"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowReposts(post);
                        }}
                      >
                        {post.reposts?.length || 0}
                      </span>
                    </div>
                    <div className="action-item">
                      <button
                        className="action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSave(post._id);
                        }}
                      >
                        {isSaved ? <BsBookmarkFill /> : <FiBookmark />}
                      </button>
                    </div>


                  </div>

                  {menuOpen === post._id && (
                    <div
                      className="menu-overlay"
                      onClick={() => setMenuOpen(null)}
                    >
                      <div
                        className="delete-sheet"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {String(post.userId?._id || post.userId) ===
                          String(user._id) ? (
                          <>
                            <button
                              className="delete-sheet-btn"
                              onClick={() => {
                                setMenuOpen(null);
                                navigate(`/create-post?mode=edit&postId=${post._id}`);
                              }}
                            >
                              ✏️ Edit
                            </button>

                            <button
                              className="delete-sheet-btn"
                              onClick={() => handleCopyLink(post._id)}
                            >
                              🔗 Copy Link
                            </button>

                            <button
                              className="delete-sheet-btn"
                              onClick={() => handleDelete(post._id)}
                              disabled={deletingPostId === post._id}
                            >
                              {deletingPostId === post._id
                                ? "⏳ Deleting..."
                                : "🗑 Delete"}
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="delete-sheet-btn"
                              onClick={() => handleSave(post._id)}
                            >
                              {isSaved ? "🔖 Unsave" : "🔖 Save"}
                            </button>

                            <button
                              className="delete-sheet-btn"
                              onClick={() => handleCopyLink(post._id)}
                            >
                              🔗 Copy Link
                            </button>

                            <button
                              className="delete-sheet-btn"
                              onClick={async () => {
                                try {
                                  await API.post(`/posts/report/${post._id}`, {
                                    reporterId: user._id,
                                    reason: "",
                                  });

                                  setMenuOpen(null);
                                  alert("Post reported successfully.");
                                } catch (error) {
                                  console.log("REPORT POST ERROR =>", error);

                                  alert(
                                    error.response?.data?.message ||
                                    "Unable to report this post."
                                  );
                                }
                              }}
                            >
                              🚩 Report
                            </button>

                            <button
                              className="delete-sheet-btn"
                              onClick={() => {
                                alert("Not Interested coming next.");
                              }}
                            >
                              🚫 Not Interested
                            </button>

                            <button
                              className="delete-sheet-btn"
                              onClick={() => {
                                alert("Mute User coming next.");
                              }}
                            >
                              🔇 Mute User
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </main>

          <Rightbar />
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="post-modal">
            <div className="modal-header">
              <button onClick={handleCancel}>Cancel</button>
              <h3>Create Post</h3>

              <button onClick={handlePost}>Post</button>
            </div>

            <div className="modal-body">
              <img
                className="modal-avatar"
                src={user?.avatar || "https://i.pravatar.cc/150"}
                alt=""
              />

              <textarea
                placeholder="What's new?"
                value={content}
                maxLength={280}
                onChange={(e) => setContent(e.target.value)}
              />

              <div className="character-counter">
                {content.length}/280
              </div>

              {imagePreview && (
                <div className="preview-wrapper">
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="preview-image"
                  />

                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => {
                      setImagePreview("");
                      setSelectedImage(null);
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                id="postImage"
                hidden
                onChange={handleImageChange}
              />

              <div className="modal-icons">
                <label htmlFor="postImage">🖼️</label>

                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowEmoji(!showEmoji)}
                >
                  😊
                </span>

                <span>📍</span>

                <span>#</span>
              </div>

              {showEmoji && (
                <div ref={emojiRef} className="emoji-picker-wrapper">
                  <EmojiPicker
                    width={290}
                    height={330}
                    onEmojiClick={(emojiData) => {
                      setContent((prev) => prev + emojiData.emoji);
                      setShowEmoji(false);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedPost && (
        <div
          className="modal-overlay"
          onClick={() => {
            console.log("OVERLAY CLICK");
            setSelectedPost(null);
          }}
        >
          <div className="comment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="comment-header">
              <h3>Comments</h3>

              <button
                className="close-comment"
                onClick={() => setSelectedPost(null)}
              >
                ✕
              </button>
            </div>

            <div className="comments-list">

              {selectedPost.comments?.length > 0 ? (
                selectedPost.comments.map((comment, index) => {

                  const replyCount = comment.replies?.length || 0;

                  return (
                    <div className="comment-thread" key={index}>

                      {/* MAIN COMMENT */}
                      <div className="comment-item">

                        <img
                          src={
                            comment.avatar ||
                            "https://i.pravatar.cc/100"
                          }
                          alt=""
                          className="comment-avatar"
                        />

                        <div className="comment-content">

                          <div className="comment-top-row">

                            <div>
                              <p className="comment-text">
                                {comment.text}
                              </p>

                              {comment.image && (
                                <img
                                  src={comment.image}
                                  className="comment-image"
                                  alt=""
                                />
                              )}
                            </div>


                            <button
                              className="comment-menu-btn"
                              onClick={() =>
                                setCommentMenuOpen(
                                  commentMenuOpen === index ? null : index
                                )
                              }
                            >
                              ⋯
                            </button>

                          </div>


                          {commentMenuOpen === index && (
                            <div className="comment-menu">

                              <button>
                                🔖 Save comment
                              </button>

                              <button>
                                🚩 Report
                              </button>

                              {comment.userId === user._id && (
                                <button
                                  className="danger"
                                  onClick={async () => {

                                    try {

                                      await API.delete(
                                        `/posts/comment/${selectedPost._id}/${index}`
                                      );


                                      const res = await API.get("/posts");


                                      setPosts(res.data);


                                      const updatedPost = res.data.find(
                                        (p) => p._id === selectedPost._id
                                      );


                                      setSelectedPost(updatedPost);

                                      setCommentMenuOpen(null);


                                    } catch (error) {

                                      console.log(error);

                                    }

                                  }}
                                >
                                  🗑 Delete
                                </button>
                              )}

                            </div>
                          )}


                          <div className="comment-actions">


                            {/* LIKE */}
                            <button
                              onClick={async () => {
                                try {
                                  await API.put(
                                    `/posts/comment-like/${selectedPost._id}/${index}`,
                                    {
                                      userId: user._id,
                                    }
                                  );

                                  const res = await API.get("/posts");

                                  setPosts(res.data);

                                  const updatedPost = res.data.find(
                                    (p) => p._id === selectedPost._id
                                  );

                                  setSelectedPost(updatedPost);

                                } catch (error) {
                                  console.log(error);
                                }
                              }}
                            >
                              ❤️ Like {comment.likes?.length || 0}
                            </button>



                            {/* REPLY */}
                            <button
                              onClick={() => {
                                setReplyingTo(
                                  replyingTo === index ? null : index
                                );

                                setReplyText("");
                                setReplyPreview("");
                                setReplyImage(null);
                              }}
                            >
                              💬 Reply
                            </button>



                            {/* REPOST */}
                            <button
                              className={
                                commentRepostAnimation === index
                                  ? "comment-repost-active"
                                  : ""
                              }
                              onClick={() => {

                                handleCommentRepost(index);

                                setCommentRepostAnimation(index);

                                setTimeout(() => {
                                  setCommentRepostAnimation(null);
                                }, 400);

                              }}
                            >
                              🔁 Repost {comment.reposts?.length || 0}
                            </button>

                            <button
                              onClick={() => {
                                setShareComment(comment);
                                fetchUsers();
                              }}
                            >
                              ✈ Share
                            </button>

                          </div>

                        </div>

                      </div>

                      {/* REPLY INPUT */}
                      {replyingTo === index && (
                        <div className="reply-input-wrapper">

                          <img
                            src={
                              user.avatar ||
                              "https://i.pravatar.cc/100"
                            }
                            className="reply-input-avatar"
                            alt=""
                          />

                          <div className="reply-input-content">

                            <input
                              type="text"
                              placeholder="Write a reply..."
                              value={replyText}
                              onChange={(e) =>
                                setReplyText(e.target.value)
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleReply(index);
                                }
                              }}
                            />

                            {replyPreview && (
                              <div className="reply-preview-wrapper">
                                <img
                                  src={replyPreview}
                                  className="reply-preview"
                                  alt=""
                                />

                                <button
                                  onClick={() => {
                                    setReplyImage(null);
                                    setReplyPreview("");
                                  }}
                                >
                                  ✕
                                </button>
                              </div>
                            )}

                            <div className="reply-input-actions">

                              <label className="reply-image-btn">
                                📷
                                <input
                                  type="file"
                                  accept="image/*"
                                  hidden
                                  onChange={handleReplyImage}
                                />
                              </label>

                              <button
                                className="reply-send-btn"
                                onClick={() =>
                                  handleReply(index)
                                }
                              >
                                Reply
                              </button>

                            </div>

                          </div>

                        </div>
                      )}

                      {/* REPLIES */}
                      {expandedReplies[index] &&
                        replyCount > 0 && (
                          <div className="replies-container">

                            {comment.replies.map(
                              (reply, replyIndex) => {

                                const replyLiked =
                                  reply.likes?.some(
                                    (id) =>
                                      id === user._id ||
                                      id?._id === user._id
                                  );

                                return (
                                  <div
                                    className="reply-item"
                                    key={replyIndex}
                                  >

                                    <div className="reply-line" />

                                    <img
                                      src={
                                        reply.avatar ||
                                        "https://i.pravatar.cc/100"
                                      }
                                      className="reply-avatar"
                                      alt=""
                                    />

                                    <div className="reply-content">

                                      <p className="reply-text">
                                        {reply.text}
                                      </p>

                                      {reply.image && (
                                        <img
                                          src={reply.image}
                                          className="reply-image"
                                          alt=""
                                        />
                                      )}

                                      <div className="reply-actions">

                                        <button
                                          className={
                                            replyLiked
                                              ? "reply-liked"
                                              : ""
                                          }
                                          onClick={async () => {
                                            try {
                                              await API.put(
                                                `/posts/reply-like/${selectedPost._id}/${index}/${replyIndex}`,
                                                {
                                                  userId:
                                                    user._id,
                                                }
                                              );

                                              const res =
                                                await API.get(
                                                  "/posts"
                                                );

                                              setPosts(res.data);

                                              const updatedPost =
                                                res.data.find(
                                                  (p) =>
                                                    p._id ===
                                                    selectedPost._id
                                                );

                                              setSelectedPost(
                                                updatedPost
                                              );
                                            } catch (error) {
                                              console.log(
                                                error
                                              );
                                            }
                                          }}
                                        >
                                          {replyLiked
                                            ? "❤️"
                                            : "♡"}{" "}
                                          {reply.likes?.length ||
                                            0}
                                        </button>

                                        <button
                                          onClick={() => {
                                            setReplyingTo(
                                              index
                                            );
                                          }}
                                        >
                                          Reply
                                        </button>

                                      </div>

                                    </div>

                                  </div>
                                );
                              }
                            )}

                          </div>
                        )}

                    </div>
                  );
                })
              ) : (
                <div className="no-comments">
                  No comments yet 👀
                </div>
              )}

            </div>

            <div className="comment-input-box">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />

              <button onClick={handleComment}>Post</button>
            </div>
          </div>
        </div>
      )}

      {shareComment && (
        <div
          className="modal-overlay"
          onClick={() => setShareComment(null)}
        >

          <div
            className="comment-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="comment-header">
              <h3>Share Comment</h3>

              <button
                onClick={() => setShareComment(null)}
              >
                ✕
              </button>
            </div>


            <div className="share-users">

              <p>Select user to share</p>


              {allUsers.map((shareUser) => (

                <div
                  className="share-user-item"
                  key={shareUser._id}
                  onClick={() => shareCommentToUser(shareUser)}
                >

                  <img
                    src={
                      shareUser.avatar ||
                      "https://i.pravatar.cc/100"
                    }
                    className="share-user-avatar"
                  />

                  <span>
                    {shareUser.username}
                  </span>

                </div>

              ))}


            </div>

          </div>

        </div>
      )}

      {showLikes && (
        <div className="modal-overlay" onClick={() => setShowLikes(null)}>
          <div className="comment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="comment-header">
              <h3>Likes</h3>

              <button
                className="likes-close-btn"
                onClick={() => setShowLikes(null)}
              >
                ✕
              </button>
            </div>

            {showLikes.likes?.length > 0 ? (
              showLikes.likes.map((likedUser) => (
                <div
                  key={likedUser._id}
                  className="likes-user"
                  onClick={() => navigate(`/user/${likedUser._id}`)}
                >
                  <img
                    src={likedUser.avatar || "https://i.pravatar.cc/100"}
                    alt=""
                    className="likes-user-avatar"
                  />
                  <span className="likes-user-name">{likedUser.username}</span>
                </div>
              ))
            ) : (
              <p>No likes yet</p>
            )}
          </div>
        </div>
      )}

      {showReposts && (
        <div className="modal-overlay" onClick={() => setShowReposts(null)}>
          <div className="comment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="comment-header">
              <h3>Reposted By</h3>

              <button
                className="likes-close-btn"
                onClick={() => setShowReposts(null)}
              >
                ✕
              </button>
            </div>

            {showReposts.reposts?.length > 0 ? (
              showReposts.reposts.map((repostUser) => (
                <div
                  key={repostUser._id}
                  className="likes-user"
                  onClick={() => navigate(`/user/${repostUser._id}`)}
                >
                  <img
                    src={repostUser.avatar || "https://i.pravatar.cc/100"}
                    alt=""
                    className="likes-user-avatar"
                  />

                  <span className="likes-user-name">{repostUser.username}</span>
                </div>
              ))
            ) : (
              <p>No reposts yet</p>
            )}
          </div>
        </div>
      )}
      {viewImage && (
        <div
          className="image-viewer-overlay"
          onClick={() => setViewImage(null)}
        >
          <button
            className="image-viewer-close"
            onClick={() => setViewImage(null)}
          >
            ×
          </button>

          <img
            src={viewImage}
            alt="Full size"
            className="image-viewer-image"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default Home;
