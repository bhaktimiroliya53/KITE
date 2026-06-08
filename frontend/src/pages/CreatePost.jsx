import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const navigate = useNavigate();

  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState(null);
  console.log(image);
  return (
    <div className="create-post-page">
      <div className="create-post-card">
        <h2 style={{color: "white"}}>Create Post</h2>

        <input
          type="text"
          placeholder="Paste image URL..."
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <textarea
          placeholder="Write your caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <div className="create-post-buttons">
          <button onClick={() => navigate("/home")}>Cancel</button>

          <button>Post</button>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
