import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function EditProfile() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [username, setUsername] = useState(user?.username || "");

  const [bio, setBio] = useState(user?.bio || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");

  const handleSave = async () => {
    try {
      const res = await API.put(`/users/${user._id}`, {
        username,
        bio,
        avatar,
      });

      localStorage.setItem("user", JSON.stringify(res.data));

      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const data = new FormData();

    data.append("file", file);
    data.append("upload_preset", "kiteapp");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
        {
          method: "POST",
          body: data,
        },
      );

      const result = await res.json();

      setAvatar(result.secure_url);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="edit-page">
      <div className="edit-container">
        <div className="edit-sidebar">
          <h3>Account</h3>

          <div className="sidebar-item active">Profile</div>

          <div className="sidebar-item">Security</div>

          <div className="sidebar-item">Privacy</div>
        </div>

        <div className="edit-content">
          <div className="edit-top">
            <button className="back-arrow" onClick={() => navigate("/profile")}>
              ←
            </button>

            <h2>Account Settings</h2>
          </div>

          <div className="profile-image-section">
            <img
              src={avatar || user?.avatar || "https://i.pravatar.cc/150"}
              alt=""
              className="edit-avatar"
            />

            <input
              type="file"
              id="avatarInput"
              hidden
              onChange={handleAvatarChange}
            />

            <button
              onClick={() => document.getElementById("avatarInput").click()}
            >
              Upload Image
            </button>
          </div>

          <label>Username</label>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Bio</label>

          <textarea value={bio} onChange={(e) => setBio(e.target.value)} />

          <div className="edit-actions">
            <button className="cancel-btn" onClick={() => navigate("/profile")}>
              Cancel
            </button>

            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
