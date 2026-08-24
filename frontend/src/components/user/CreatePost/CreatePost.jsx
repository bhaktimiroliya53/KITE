import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/user/createpost.css";

function CreatePost() {
  const navigate = useNavigate();

  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState(null);

  const handlePost = () => {
    // Post API logic later
    console.log({
      caption,
      imageUrl,
      image,
    });
  };

  return (
    <div className="create-post-page">
      <div className="create-post-card">

        <h2>Create Post</h2>

        <div className="create-post-field">
          <label>Image URL</label>

          <input
            type="text"
            placeholder="Paste image URL..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        <div className="create-post-field">
          <label>Upload Image</label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div className="create-post-field">
          <label>Caption</label>

          <textarea
            placeholder="Write your caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>

        <div className="create-post-buttons">

          <button
            className="create-post-cancel"
            onClick={() => navigate("/home")}
          >
            Cancel
          </button>

          <button
            className="create-post-submit"
            onClick={handlePost}
          >
            Post
          </button>

        </div>

      </div>
    </div>
  );
}

export default CreatePost;