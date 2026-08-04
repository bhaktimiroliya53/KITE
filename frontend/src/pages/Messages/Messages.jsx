import { useState, useEffect } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function Messages() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");

      const currentUser = JSON.parse(localStorage.getItem("user"));

      setUsers(res.data.filter((u) => u._id !== currentUser._id));
    } catch (error) {
      console.log(error);
    }
  };
  const fetchMessages = async (userId) => {
    const currentUser = JSON.parse(localStorage.getItem("user"));

    const res = await API.get(`/messages/${currentUser._id}/${userId}`);

    setMessages(res.data);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const currentUser = JSON.parse(localStorage.getItem("user"));

    await API.post("/messages", {
      senderId: currentUser._id,
      receiverId: selectedUser._id,
      text: message,
    });

    setMessage("");

    fetchMessages(selectedUser._id);
  };

  return (
    <div className="chat-container">
      <div className="users-list">
        <div className="users-header">
          <button className="back-btn" onClick={() => navigate("/home")}>
            <FaArrowLeft />
          </button>

          <h2
            style={{
              marginLeft: "60px",
              marginTop: "12px",
            }}
          >
            Messages
          </h2>
        </div>
        {users.map((user) => (
          <div
            key={user._id}
            className="user-item"
            onClick={() => navigate(`/chat/${user._id}`)}
          >
            <img src={user.avatar || "https://i.pravatar.cc/100"} alt="" />

            <span>{user.username}</span>
          </div>
        ))}
      </div>

      <div className="chat-area">
        {selectedUser ? (
          <>
            <div
              className="chat-header"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <button
                className="back-btn"
                onClick={() => setSelectedUser(null)}
              >
                <FaArrowLeft />
              </button>

              <img
                src={selectedUser.avatar || "https://i.pravatar.cc/100"}
                alt=""
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />

              <div>
                <h3 style={{ margin: 0 }}>{selectedUser.username}</h3>
              </div>
            </div>

            <div className="messages-box">
              {messages.length > 0 ? (
                messages.map((msg) => {
                  const currentUser = JSON.parse(localStorage.getItem("user"));

                  const isMine =
                    String(msg.senderId?._id || msg.senderId) ===
                    String(currentUser._id);
                  return (
                    <div
                      key={msg._id}
                      style={{
                        display: "flex",
                        justifyContent: isMine ? "flex-end" : "flex-start",
                        marginBottom: "10px",
                      }}
                    >
                      <div
                        style={{
                          background: isMine ? "#8b5cf6" : "#1f2438",
                          color: "white",
                          padding: "12px 16px",
                          borderRadius: "18px",
                          maxWidth: "300px",
                          wordBreak: "break-word",
                        }}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>No messages yet</p>
              )}
            </div>

            <div className="chat-input">
              <input
                type="text"
                placeholder="Type message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
              />

              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div className="empty-chat">
            <div className="empty-chat-content">
              <h1>💬</h1>
              <h2>Welcome to KITE Messages</h2>
              <p>
                Select a conversation from the left panel to start chatting.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;
