import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function SavedPosts() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [savedPosts, setSavedPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  const fetchSavedPosts = async () => {
    try {
      const res = await API.get("/posts");

      const saved = res.data.filter((post) => post.savedBy?.includes(user._id));

      setSavedPosts(saved);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="profile-page">
      <button className="back-btn" onClick={() => navigate("/profile")}>
        ←
      </button>

      <div className="profile-header">
        <h2>🔖 Saved Posts</h2>
        <p>{savedPosts.length} Saved Posts</p>
      </div>

      <div className="profile-tabs">
        <button className="active-tab">🔖 Saved</button>
      </div>

      <div className="profile-posts-grid">
        {savedPosts.map((post) => (
          <div
            className="profile-post-card"
            key={post._id}
            onClick={() => setSelectedPost(post)}
            style={{ cursor: "pointer" }}
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
      {selectedPost && (
        <div className="modal-overlay" onClick={() => setSelectedPost(null)}>
          <div
            className="post-preview-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-modal-btn"
              onClick={() => setSelectedPost(null)}
            >
              ×
            </button>

            <h3>{selectedPost.username}</h3>

            <p>{selectedPost.content}</p>

            {selectedPost.image && (
              <img src={selectedPost.image || "https://placehold.co/600x400"}
                alt="" className="preview-image" />
            )}

            <div className="preview-stats">
              ❤️ {selectedPost.likes?.length || 0}
              {" • "}
              💬 {selectedPost.comments?.length || 0}
              {" • "}
              🔁 {selectedPost.reposts?.length || 0}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SavedPosts;
