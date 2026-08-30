import { useEffect, useState, useRef } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import "../../styles/user/profile.css";

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
      const res = await API.get(
        `/posts/user/${user._id}?currentUserId=${user._id}`
      );

      setPosts(res.data.posts || []);
    } catch (error) {
      console.log("FETCH PROFILE POSTS ERROR =>", error);
      setPosts([]);
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

      {/* BACK BUTTON */}
      <button className="back-btn" onClick={() => navigate("/home")}>
        ←
      </button>

      {/* PROFILE HEADER */}
      <section className="profile-header">

        <div className="profile-main">

          {/* AVATAR */}
          <div className="profile-avatar-wrapper">
            <img
              src={profileUser?.avatar || "https://i.pravatar.cc/150"}
              alt={user?.username || "Profile"}
              className="profile-avatar"
            />
          </div>

          {/* PROFILE DETAILS */}
          <div className="profile-details">

            <div className="profile-title-row">
              <h2>{profileUser?.username}</h2>

              <span className="profile-badge">
                ✓
              </span>
            </div>

            <p className="profile-bio">
              {profileUser?.bio || "No bio yet."}
            </p>

            {/* STATS */}
            <div className="profile-stats">

              <div>
                <h3>{posts.length}</h3>
                <span>Posts</span>
              </div>

              <div onClick={() => setShowFollowers(true)}>
                <h3>
                  {profileUser?.followers?.length || 0}
                </h3>
                <span>Followers</span>
              </div>

              <div onClick={() => setShowFollowing(true)}>
                <h3>
                  {profileUser?.following?.length || 0}
                </h3>
                <span>Following</span>
              </div>

            </div>

            {/* ACTION BUTTONS */}
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

        </div>

      </section>

      {/* POSTS SECTION */}
      <section className="profile-post-section">

        <div className="profile-tabs">
          <button className="active-tab">
            ▦ Posts
          </button>
        </div>

        <div className="profile-posts-grid">

          {posts.map((post) => (
            <div
              className="profile-post-card"
              key={post._id}
              onClick={() => navigate(`/post/${post._id}`)}
            >

              {post.image ? (
                <img
                  src={post.image}
                  alt="Post"
                  className="profile-post-image"
                />
              ) : (
                <div className="text-post-card">
                  {post.content}
                </div>
              )}

            </div>
          ))}

        </div>

      </section>

      {/* FOLLOWERS MODAL */}
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
              </button>
            </div>

            {profileUser?.followers?.length > 0 ? (
              profileUser.followers.map((follower) => (
                <div
                  className="user-list-item"
                  key={follower._id}
                  onClick={() => {
                    setShowFollowers(false);
                    navigate(`/user/${follower._id}`);
                  }}
                >
                  <img
                    src={follower.avatar || "https://i.pravatar.cc/50"}
                    alt={follower.username || "User"}
                  />

                  <span>
                    {follower.username}
                  </span>
                </div>
              ))
            ) : (
              <p>No followers yet</p>
            )}

          </div>
        </div>
      )}

      {/* FOLLOWING MODAL */}
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

            {profileUser?.following?.length > 0 ? (
              profileUser.following.map((followingUser) => (
                <div
                  className="user-list-item"
                  key={followingUser._id}
                  onClick={() => {
                    setShowFollowing(false);
                    navigate(`/user/${followingUser._id}`);
                  }}
                >
                  <img
                    src={followingUser.avatar || "https://i.pravatar.cc/50"}
                    alt={followingUser.username || "User"}
                  />

                  <span>
                    {followingUser.username}
                  </span>
                </div>
              ))
            ) : (
              <p>Not following anyone</p>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

export default Profile;
