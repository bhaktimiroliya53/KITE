import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";

function UserProfile() {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [posts, setPosts] = useState([]);

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await API.get(`/users/${id}`);

      setUser(res.data);

      setIsFollowing(
        res.data.followers?.some(
          (follower) => follower._id === currentUser._id,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");

      const userPosts = res.data.filter((post) => post.userId?._id === id);

      setPosts(userPosts);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFollow = async () => {
    try {
      await API.put(`/users/follow/${id}`, {
        currentUserId: currentUser._id,
      });

      fetchUser();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, [id]);

  if (!user) return <h2>Loading...</h2>;

  return (
    <div className="profile-page">
      <button
        onClick={() => navigate(-1)}
        style={{
          color: "white",
          fontSize: "28px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        ←
      </button>

      <div className="profile-header">
        <img
          src={user.avatar || "https://i.pravatar.cc/150"}
          alt=""
          width="120"
          height="120"
          style={{
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />

        <h2>{user.username}</h2>

        <p>{user.bio || "No bio yet"}</p>

        <div className="profile-stats">
          <div>
            <h3>{posts.length}</h3>
            <span>Posts</span>
          </div>

          <div
            style={{ cursor: "pointer" }}
            onClick={() => setShowFollowers(true)}
          >
            <h3>{user.followers?.length || 0}</h3>
            <span>Followers</span>
          </div>

          <div
            style={{ cursor: "pointer" }}
            onClick={() => setShowFollowing(true)}
          >
            <h3>{user.following?.length || 0}</h3>
            <span>Following</span>
          </div>
        </div>

        {currentUser._id !== user._id && (
          <button className="edit-profile-btn" onClick={handleFollow}>
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>

      <div className="profile-tabs">
        <button className="active-tab">▦ Posts</button>
      </div>

      <div className="profile-posts-grid">
        {posts.map((post) => (
          <div className="profile-post-card" key={post._id}>
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

            {user.followers?.length > 0 ? (
              user.followers.map((follower) => (
                <div
                  key={follower._id}
                  onClick={() => {
                    setShowFollowers(false);
                    navigate(`/user/${follower._id}`);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "12px",
                    cursor: "pointer",
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
              ))
            ) : (
              <p>No followers yet</p>
            )}
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

            {user.following?.length > 0 ? (
              user.following.map((following) => (
                <div
                  key={following._id}
                  onClick={() => {
                    setShowFollowing(false);
                    navigate(`/user/${following._id}`);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "12px",
                    cursor: "pointer",
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

export default UserProfile;
