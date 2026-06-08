import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Search() {
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
    <div className="search-page">
      <div className="search-header">
        <button className="back-btn" onClick={() => navigate("/home")}>
          ←
        </button>

        <h2>Search Users</h2>
      </div>

      <input
        className="search-input"
        type="text"
        placeholder="🔍 Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="users-list">
        {filteredUsers.map((user) => (
          <div
            className="user-card"
            key={user._id}
            onClick={() => navigate(`/user/${user._id}`)}
          >
            <img src={user.avatar || "https://i.pravatar.cc/150"} alt="" />

            <div className="user-info">
              <h3>{user.username}</h3>
              <p>KITE User</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
