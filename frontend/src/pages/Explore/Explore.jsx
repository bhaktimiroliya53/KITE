import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "../../styles/user/Explore.css";

function Explore() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="explore-page">

      <div className="explore-header">
        <div>
          <h1>Discover</h1>
          <p>Find people and discover new connections.</p>
        </div>

        <button
          className="explore-back-btn"
          onClick={() => navigate("/home")}
        >
          ← Back
        </button>
      </div>

      <div className="explore-search">
        <span>🔍</span>

        <input
          type="text"
          placeholder="Search people..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="discover-section">

        <div className="section-heading">
          <h2>People on KITE</h2>
          <span>{filteredUsers.length} users</span>
        </div>

        <div className="discover-grid">

          {filteredUsers.length === 0 ? (
            <div className="no-users">
              <h3>No users found</h3>
              <p>Try searching for another username.</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                className="discover-card"
                key={user._id}
                onClick={() => navigate(`/user/${user._id}`)}
              >
                <img
                  src={user.avatar || "https://i.pravatar.cc/150"}
                  alt={user.username}
                />

                <div className="discover-user-info">
                  <h3>{user.username}</h3>

                  <p>
                    {user.bio || "KITE User"}
                  </p>
                </div>

                <button
                  className="view-profile-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/user/${user._id}`);
                  }}
                >
                  View Profile
                </button>
              </div>
            ))
          )}

        </div>

      </div>

    </div>
  );
}

export default Explore;