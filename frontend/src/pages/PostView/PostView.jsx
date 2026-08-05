import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";

function PostView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await API.get("/posts");

      const foundPost = res.data.find((p) => p._id === id);

      setPost(foundPost);
    } catch (error) {
      console.log(error);
    }
  };

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const handleComment = async () => {
    if (!comment.trim()) return;

    try {
      const res = await API.put(`/posts/comment/${post._id}`, {
        userId: currentUser._id,
        username: currentUser.username,
        text: comment,
      });

      setPost(res.data);
      setComment("");
    } catch (error) {
      console.log(error);
    }
  };

  if (!post) return <h2>Loading...</h2>;

  return (
    <div className="profile-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ←
      </button>

      <div
        className="profile-header"
        style={{
          maxWidth: "550px",
          margin: "0 auto",
        }}
      >
        <img
          src={post.userId?.avatar || "https://i.pravatar.cc/150"}
          alt=""
          width="70"
          height="70"
          style={{
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />

        <h2>{post.userId?.username}</h2>

        <p
          style={{
            marginTop: "15px",
            textAlign: "left",
            width: "100%",
          }}
        >
          {post.content}
        </p>

        {post.image && (
          <img
            src={post.image}
            alt=""
            style={{
              width: "100%",
              maxWidth: "700px",
              borderRadius: "20px",
              marginTop: "20px",
              objectFit: "cover",
            }}
          />
        )}

        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "15px",
            fontSize: "18px",
            justifyContent: "flex-start",
          }}
        >
          ❤️ {post.likes?.length || 0}
          {"  •  "}
          💬 {post.comments?.length || 0}
        </div>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            gap: "10px",
          }}
        >
          <input
            type="text"
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid #333",
              background: "#1f2438",
              color: "white",
            }}
          />

          <button
            onClick={handleComment}
            style={{
              padding: "14px 20px",
              borderRadius: "12px",
              border: "none",
              background: "#7c3aed",
              color: "white",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Post
          </button>
        </div>
        <div style={{ marginTop: "25px" }}>
          <h3>Comments</h3>

          {post.comments?.length === 0 ? (
            <p>No comments yet</p>
          ) : (
            post.comments.map((c, index) => (
              <div
                key={index}
                style={{
                  padding: "15px",
                  marginTop: "12px",
                  background: "#1f2438",
                  borderRadius: "12px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                  textAlign: "left",
                }}
              >
                <strong
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    color: "white",
                  }}
                >
                  {c.username}
                </strong>

                <p
                  style={{
                    margin: 0,
                    color: "#d1d5db",
                    wordBreak: "break-word",
                  }}
                >
                  {c.text}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default PostView;
