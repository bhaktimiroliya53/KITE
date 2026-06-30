import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import API from "../services/api";
import EmojiPicker from "emoji-picker-react";
import socket from "../services/socket";

function Chat() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const emojiRef = useRef(null);
  const messagesEndRef = useRef(null);

  // const [activeReaction, setActiveReaction] = useState(null);
  const [typing, setTyping] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState(null);

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

  useEffect(() => {
    socket.connect();

    socket.emit("join", currentUser._id);

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on("typing", () => {
      console.log("⌨️ RECEIVED TYPING");
      setTyping(true);
    });

    socket.on("receiveMessage", (newMessage) => {
      console.log("📩 NEW MESSAGE:", newMessage);

      const sender = String(newMessage.senderId?._id || newMessage.senderId);

      const receiver = String(
        newMessage.receiverId?._id || newMessage.receiverId,
      );

      if (
        (sender === currentUser._id && receiver === userId) ||
        (sender === userId && receiver === currentUser._id)
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    // 🗑 Real-time Delete
    socket.on("messageDeleted", (messageId) => {
      console.log("🗑 MESSAGE DELETED:", messageId);

      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    });

    socket.on("stopTyping", () => {
      console.log("🛑 RECEIVED STOP");
      setTyping(false);
    });

    return () => {
      socket.off("typing");
      socket.off("stopTyping");
      socket.off("receiveMessage");
      socket.off("messageDeleted");
    };
  }, [currentUser._id, userId]);

  useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages, typing]);

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

      console.log("CURRENT USER =>", currentUser._id);
      console.log("MESSAGES =>", res.data);
      res.data.forEach((msg) => {
        console.log(
          msg.text,
          msg.reactions.map((r) => ({
            userId: r.userId,
            emoji: r.emoji,
          })),
        );
      });

      setMessages(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() && !selectedImage) return;

    try {
      let imageUrl = "";

      if (selectedImage) {
        const formData = new FormData();

        formData.append("file", selectedImage);
        formData.append("upload_preset", "kite_upload");

        const cloudRes = await fetch(
          "https://api.cloudinary.com/v1_1/kiteapp/image/upload",
          {
            method: "POST",
            body: formData,
          },
        );

        const cloudData = await cloudRes.json();

        imageUrl = cloudData.secure_url;
      }

      await API.post("/messages", {
        senderId: currentUser._id,
        receiverId: userId,
        text: message,
        image: imageUrl,
      });

      setMessage("");
      setSelectedImage(null);
      setImagePreview("");

      socket.emit("stopTyping", {
        senderId: currentUser._id,
        receiverId: userId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const deleteMessage = async (messageId) => {
    const ok = window.confirm("Delete this message?");

    if (!ok) return;

    try {
      await API.delete(`/messages/${messageId}`);

      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
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
                  onContextMenu={(e) => {
                    e.preventDefault();

                    if (isMine) {
                      setDeleteMsg(msg);
                    }
                  }}
                >
                  <>
                    {msg.text && <p>{msg.text}</p>}

                    {msg.image && (
                      <img src={msg.image} alt="chat" className="chat-image" />
                    )}
                  </>
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

        {typing && (
          <div className="message-row">
            <div>
              <small className="typing-text">Typing...</small>

              <div className="typing-bubble">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {imagePreview && (
        <div className="chat-preview-container">
          <img src={imagePreview} alt="preview" className="chat-preview" />

          <button
            className="remove-preview"
            onClick={() => {
              setImagePreview("");
              setSelectedImage(null);
            }}
          >
            ✕
          </button>
        </div>
      )}

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);

            if (e.target.value.trim() !== "") {
              socket.emit("typing", {
                senderId: currentUser._id,
                receiverId: userId,
              });
            }

            clearTimeout(window.typingTimer);

            window.typingTimer = setTimeout(() => {
              socket.emit("stopTyping", {
                senderId: currentUser._id,
                receiverId: userId,
              });
            }, 1000);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        {deleteMsg && (
          <div className="delete-overlay">
            <div className="delete-modal">
              <h3>Delete Message?</h3>

              <p>This action cannot be undone.</p>

              <div className="delete-actions">
                <button
                  className="cancel-btn"
                  onClick={() => setDeleteMsg(null)}
                >
                  Cancel
                </button>

                <button
                  className="delete-btn"
                  onClick={async () => {
                    try {
                      await API.delete(`/messages/${deleteMsg._id}`);

                      setMessages((prev) =>
                        prev.filter((m) => m._id !== deleteMsg._id),
                      );

                      setDeleteMsg(null);
                    } catch (err) {
                      console.log(err);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
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

        <input
          type="file"
          id="chatImage"
          hidden
          accept="image/*"
          onChange={handleImageChange}
        />

        <label htmlFor="chatImage" className="image-btn">
          🖼️
        </label>

        <button onClick={sendMessage}>➤</button>
      </div>
    </div>
  );
}

export default Chat;
