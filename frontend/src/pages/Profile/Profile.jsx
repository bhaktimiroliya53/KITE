import { useEffect, useState, useRef } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [posts, setPosts] = useState([]);
  const fileInputRef = useRef(null);
  const [profileUser, setProfileUser] = useState(null);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  useEffect(() => {
    fetchPosts();
    fetchProfile();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");

      const myPosts = res.data.filter(
        (post) => post.userId?._id?.toString() === user._id,
      );

      setPosts(myPosts);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await API.get(`/users/${user._id}`);

      setProfileUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAvatarChange = async (e) => {
    try {
      const file = e.target.files[0];

      if (!file) return;

      const formData = new FormData();

      formData.append("file", file);
      formData.append("upload_preset", "kite_upload");

      const cloudRes = await fetch(
        "https://api.cloudinary.com/v1_1/kiteapp/image/upload",
        {
          method: "POST",
          body: formData,
        },
      );

      const cloudData = await cloudRes.json();

      const imageUrl = cloudData.secure_url;

      const res = await API.put(`/users/${user._id}`, {
        avatar: imageUrl,
      });

      localStorage.setItem("user", JSON.stringify(res.data));

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  if (!profileUser) return null;
  return (
    <div className="profile-page">
      <button className="back-btn" onClick={() => navigate("/home")}>
        ←
      </button>

      <div className="profile-header">
        <img
          src={profileUser?.avatar || "https://i.pravatar.cc/150"}
          alt=""
          className="profile-avatar"
          onClick={() => fileInputRef.current.click()}
          style={{ cursor: "pointer" }}
        />
        <input
          type="file"
          accept="image/*"
          hidden
          ref={fileInputRef}
          onChange={handleAvatarChange}
        />

        <h2>{profileUser?.username}</h2>

        <p>{profileUser?.bio || "No bio yet"}</p>

        <div className="profile-stats">
          <div>
            <h3>{posts.length}</h3>
            <span>Posts</span>
          </div>

          <div
            style={{ cursor: "pointer" }}
            onClick={() => setShowFollowers(true)}
          >
            <h3>{profileUser?.followers?.length || 0}</h3>
            <span>Followers</span>
          </div>

          <div
            style={{ cursor: "pointer" }}
            onClick={() => setShowFollowing(true)}
          >
            <h3>{profileUser?.following?.length || 0}</h3>
            <span>Following</span>
          </div>
        </div>

        <div className="profile-buttons">
          <button
            className="edit-profile-btn"
            onClick={() => navigate("/edit-profile")}
          >
            Edit Profile
          </button>

          <button
            className="saved-posts-btn"
            onClick={() => navigate("/saved-posts")}
          >
            🔖 Saved
          </button>
        </div>
      </div>

      <div className="profile-tabs">
        <button className="active-tab">▦ Posts</button>
      </div>

      <div className="profile-posts-grid">
        {posts.map((post) => (
          <div className="profile-post-card" key={post._id} onClick={() => navigate(`/post/${post._id}`)}
          >
            {post.image ? (
              <img src={post.image || "https://placehold.co/600x400"}
                alt="" className="profile-post-image" />
            ) : (
              <div className="text-post-card">{post.content}</div>
            )}
          </div>
        ))}
      </div>
      {showFollowers && (
        <div className="modal-overlay">
          <div className="comment-modal">
            <div className="comment-header">
              <h3>Followers</h3>
              <button
                className="close-modal-btn"
                onClick={() => setShowFollowers(false)}
              >
                ×
              </button>{" "}
            </div>

            {profileUser.followers?.map((follower) => (
              <div
                key={follower._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                <img
                  src={follower.avatar || "https://i.pravatar.cc/150"}
                  alt=""
                  width="40"
                  height="40"
                  style={{
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />

                <span>{follower.username}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showFollowing && (
        <div className="modal-overlay">
          <div className="comment-modal">
            <div className="comment-header">
              <h3>Following</h3>

              <button
                className="close-modal-btn"
                onClick={() => setShowFollowing(false)}
              >
                ×
              </button>
            </div>

            {profileUser.following?.map((following) => (
              <div
                key={following._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                <img
                  src={following.avatar || "https://i.pravatar.cc/150"}
                  alt=""
                  width="40"
                  height="40"
                  style={{
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />

                <span>{following.username}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
