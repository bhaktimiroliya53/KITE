import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import API from "../services/api";
import EmojiPicker from "emoji-picker-react";

function Chat() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const emojiRef = useRef(null);
  const [activeReaction, setActiveReaction] = useState(null);

  useEffect(() => {
    fetchUser();
    fetchMessages();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmoji(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchUser = async () => {
    try {
      const res = await API.get(`/users/${userId}`);
      setUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await API.get(`/messages/${currentUser._id}/${userId}`);

      console.log("MESSAGES =>", res.data);

      setMessages(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      await API.post("/messages", {
        senderId: currentUser._id,
        receiverId: userId,
        text: message,
      });

      setMessage("");

      fetchMessages();
    } catch (error) {
      console.log(error);
    }
  };

  const addReaction = async (messageId, emoji) => {
    console.log("REACTION CLICKED");

    try {
      const currentUser = JSON.parse(localStorage.getItem("user"));

      await API.put(`/messages/react/${messageId}`, {
        userId: currentUser._id,
        emoji,
      });

      fetchMessages();
    } catch (error) {
      console.log(error);
    }
  };

  if (!user) return null;

  return (
    <div className="chat-page">
      <div className="chat-header">
        <button className="back-btn" onClick={() => navigate("/messages")}>
          <FaArrowLeft />
        </button>

        <img
          src={user.avatar || user.profilePic || "https://i.pravatar.cc/100"}
          alt=""
          className="chat-avatar"
        />
        <div
          style={{
            marginLeft: "8px",
          }}
        >
          <h3>{user.username}</h3>
          <span>Active now</span>
        </div>
      </div>

      <div className="messages-box">
        {messages.map((msg) => {
          const isMine =
            String(msg.senderId?._id || msg.senderId) ===
            String(currentUser._id);

          return (
            <div
              key={msg._id}
              className={isMine ? "message-row mine" : "message-row"}
            >
              <div className="message-wrapper">
                <div
                  className={isMine ? "message-bubble mine" : "message-bubble"}
                  onDoubleClick={() => addReaction(msg._id, "❤️")}
                >
                  {msg.text}
                </div>

                {msg.reactions?.length > 0 && (
                  <div className="message-reaction-badge">
                    {msg.reactions.map((r, i) => (
                      <span key={i}>{r.emoji}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <button
          className="emoji-btn"
          onClick={(e) => {
            e.stopPropagation();
            setShowEmoji(!showEmoji);
          }}
        >
          😊
        </button>

        {showEmoji && (
          <div className="emoji-picker-chat" ref={emojiRef}>
            <EmojiPicker
              onEmojiClick={(emojiData) => {
                setMessage((prev) => prev + emojiData.emoji);
                setShowEmoji(false);
              }}
            />
          </div>
        )}

        <button onClick={sendMessage}>➤</button>
      </div>
    </div>
  );
}

export default Chat;
