import { useState, useEffect, useRef } from "react";
import logo from "../assets/logo/kite-brand-logo.png";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { FiBookmark } from "react-icons/fi";
import { BsBookmarkFill } from "react-icons/bs";
import { FaHeart, FaRegHeart, FaRegComment } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";

import { FiRepeat } from "react-icons/fi";

function Home() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [commentText, setCommentText] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [showLikes, setShowLikes] = useState(null);
  const [animatingPost, setAnimatingPost] = useState(null);
  const [showReposts, setShowReposts] = useState(null);
  const [likedAnimation, setLikedAnimation] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showCommentEmoji, setShowCommentEmoji] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const emojiRef = useRef(null);

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
      const res = await API.get("/posts");
      setPosts(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);

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
      await API.delete(`/posts/${id}`);

      fetchPosts();
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      await API.put(`/posts/like/${id}`, {
        userId: user._id,
      });

      fetchPosts();
    } catch (error) {
      console.log(error);
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

  const handleDoubleLike = (postId) => {
    setLikedAnimation(postId);

    handleLike(postId);

    setTimeout(() => {
      setLikedAnimation(null);
    }, 800);
  };

  return (
    <div className="home-page">
      {/* SIDEBAR */}

      <div className="sidebar">
        <div className="menu">
          <button onClick={() => (window.location.href = "/home")}>
            🏠 Home
          </button>

          <button onClick={() => navigate("/search")}>🔍 Explore</button>

          {/* <button>🔔 Notifications</button> */}

          <button onClick={() => navigate("/messages")}>💬 Messages</button>
          <button onClick={() => navigate("/profile")}>👤 Profile</button>
          {/* <button onClick={toggleTheme}>
            {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button> */}

          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}

      <div className="main-content">
        <div className="topbar">
          <div className="menu-icon">☰</div>

          <div className="center-logo">
            <img src={logo} alt="KITE" />
          </div>

          <div className="top-icons">
            <img
              src={user?.avatar || "https://i.pravatar.cc/150"}
              alt=""
              className="top-profile"
              onClick={() => navigate("/profile")}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>

        {/* FEED */}

        <div className="feed">
          {/* CREATE POST */}

          <div className="create-post">
            <img
              className="create-post-avatar"
              src={user?.avatar || "https://i.pravatar.cc/150"}
              alt="profile"
            />
            <input
              type="text"
              placeholder="What's on your mind?"
              readOnly
              onClick={() => setShowModal(true)}
            />

            <button onClick={() => setShowModal(true)}>➕</button>
          </div>

          {/* {isPosting && (
            <div className="feed-progress">
              <div className="feed-progress-bar"></div>
            </div>
          )} */}

          {isPosting && (
            <div
              style={{
                background: "red",
                color: "white",
                padding: "20px",
                fontSize: "30px",
              }}
            >
              POSTING...
            </div>
          )}
          {/* DYNAMIC POSTS */}

          {posts.map((post) => {
            const user = JSON.parse(localStorage.getItem("user"));

            const isSaved = post.savedBy?.includes(user._id);
            const isReposted = post.reposts?.some(
              (repostUser) =>
                repostUser._id === user._id || repostUser === user._id,
            );
            const isAnimating = animatingPost === post._id;

            return (
              <div className="post-card" key={post._id}>
                <div className="post-top">
                  <img
                    className="post-avatar"
                    src={post.userId?.avatar || "https://i.pravatar.cc/150"}
                    alt=""
                  />

                  <div>
                    <h4> {post.userId?.username}</h4>

                    <span>{new Date(post.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <p>{post.content}</p>

                {post.image && (
                  <div className="image-wrapper">
                    <img
                      src={post.image}
                      alt=""
                      className="post-image"
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        handleDoubleLike(post._id);
                      }}
                    />

                    {likedAnimation === post._id && (
                      <div className="heart-animation">❤️</div>
                    )}
                  </div>
                )}

                <div className="post-actions">
                  <div className="action-item">
                    <button
                      className="action-btn"
                      style={{
                        color: post.likes?.some(
                          (likeUser) =>
                            likeUser._id === user._id || likeUser === user._id,
                        )
                          ? "#ff3040"
                          : "white",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(post._id);
                      }}
                    >
                      {post.likes?.some(
                        (likeUser) =>
                          likeUser._id === user._id || likeUser === user._id,
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
                      className={`action-btn ${
                        isAnimating ? "repost-active" : ""
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

                  <div className="menu-wrapper">
                    <button
                      className="menu-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(menuOpen === post._id ? null : post._id);
                      }}
                    >
                      ⋯
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
                      <button
                        className="delete-sheet-btn"
                        onClick={() => handleDelete(post._id)}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT BAR */}

      <div className="rightbar">
        <h3>🔥 Trending Topics</h3>

        <div className="trend">#KITE</div>

        <div className="trend">#ReactJS</div>

        <div className="trend">#MERN</div>

        <div className="trend">#NodeJS</div>

        <div className="trend">#MongoDB</div>

        <div className="trend">#ExpressJS</div>

        <div className="trend">#JavaScript</div>

        <div className="trend">#WebDevelopment</div>

        
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
                onChange={(e) => setContent(e.target.value)}
              />

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="preview-image"
                />
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
                selectedPost.comments.map((comment, index) => (
                  <div key={index} className="comment-item">
                    <img
                      src={comment.avatar || "https://i.pravatar.cc/100"}
                      alt=""
                      className="comment-avatar"
                    />

                    <div
                      className="comment-content"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <div>
                        <h5
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate(`/user/${comment.userId}`)}
                        >
                          {comment.username}
                        </h5>

                        <p>{comment.text}</p>
                        <button
                          className="comment-like-btn"
                          onClick={async (e) => {
                            e.stopPropagation();

                            try {
                              const res = await API.put(
                                `/posts/comment-like/${selectedPost._id}/${index}`,
                                {
                                  userId: user._id,
                                },
                              );

                              console.log(res.data);

                              setSelectedPost(res.data);

                              fetchPosts();
                            } catch (error) {
                              console.log(error.response?.data);
                              console.log(error);
                            }
                          }}
                        >
                          ❤️ {comment.likes?.length || 0}
                        </button>
                      </div>

                      {comment.userId === user._id && (
                        <button
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "18px",
                          }}
                          onClick={async () => {
                            try {
                              await API.delete(
                                `/posts/comment/${selectedPost._id}/${index}`,
                              );

                              fetchPosts();

                              setSelectedPost(null);
                            } catch (error) {
                              console.log(error);
                            }
                          }}
                        >
                          🗑
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-comments">No comments yet 👀</div>
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
    </div>
  );
}

export default Home;
