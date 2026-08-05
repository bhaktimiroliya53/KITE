import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "../../styles/user/Privacy.css";
import "../../styles/user/EditProfile.css";

function EditProfile() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [username, setUsername] = useState(user?.username || "");

  const [bio, setBio] = useState(user?.bio || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");

  const [activeTab, setActiveTab] = useState("profile");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [privateAccount, setPrivateAccount] = useState(false);
  const [showActivity, setShowActivity] = useState(true);
  

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

          <div
            className={`sidebar-item ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </div>

          <div
            className={`sidebar-item ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            Security
          </div>

          <div
            className={`sidebar-item ${activeTab === "privacy" ? "active" : ""}`}
            onClick={() => setActiveTab("privacy")}
          >
            Privacy
          </div>
        </div>

        <div className="edit-content">
          <div className="edit-top">
            <button className="back-arrow" onClick={() => navigate("/profile")}>
              ←
            </button>

            <h2>Account Settings</h2>
          </div>

          {activeTab === "profile" && (
            <>
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

                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />

                <div className="edit-actions">
                  <button
                    className="cancel-btn"
                    onClick={() => navigate("/profile")}
                  >
                    Cancel
                  </button>

                  <button className="save-btn" onClick={handleSave}>
                    Save
                  </button>
                </div>
            </>
          )}

          {activeTab === "security" && (
            <>
              <label>Current Password</label>

              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />

              <label>New Password</label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <label>Confirm Password</label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <div className="edit-actions">
                <button
                  className="save-btn"
                  onClick={async () => {
                    if (newPassword !== confirmPassword) {
                      return alert("Passwords do not match");
                    }

                    try {
                      const res = await API.put("/auth/change-password", {
                        userId: user._id,
                        currentPassword,
                        newPassword,
                      });

                      alert(res.data.message);

                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                    } catch (err) {
                      alert(err.response?.data?.message);
                    }
                  }}
                >
                  Change Password
                </button>
              </div>
            </>
          )}

          {activeTab === "privacy" && (
            <>
              <div className="privacy-card">
                <div className="privacy-row">
                  <div>
                    <h4>Private Account</h4>
                    <p>Only approved followers can see your posts.</p>
                  </div>

                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={privateAccount}
                      onChange={() => setPrivateAccount(!privateAccount)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="privacy-row">
                  <div>
                    <h4>Activity Status</h4>
                    <p>Allow others to see when you're active.</p>
                  </div>

                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={showActivity}
                      onChange={() => setShowActivity(!showActivity)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
