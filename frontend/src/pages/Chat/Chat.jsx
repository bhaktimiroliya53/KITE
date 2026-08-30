import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import API from "../../services/api";
import EmojiGifPicker from "../../components/chat/EmojiGifPicker";
import socket from "../../services/socket";
import "../../styles/user/message.css";
import "../../styles/user/chat.css";

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
  const messagesEndRef = useRef(null);
  const [typing, setTyping] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState(null);
  const [editMessage, setEditMessage] = useState(null);
  const [editText, setEditText] = useState("");
  const emojiRef = useRef(null);
  const [selectedGif, setSelectedGif] = useState(null);

  useEffect(() => {
    fetchUser();
    fetchMessages();
  }, []);


  useEffect(() => {

    const handleClickOutside = (event) => {

      if (
        emojiRef.current &&
        !emojiRef.current.contains(event.target)
      ) {
        setShowEmoji(false);
      }

    };


    document.addEventListener(
      "mousedown",
      handleClickOutside
    );


    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };


  }, []);

  useEffect(() => {

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join", currentUser._id);


    return () => {
      socket.off("join");
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


      res.data.forEach((msg) => {

      });

      setMessages(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() && !selectedImage && !selectedGif) return;

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
console.log("SENDING GIF =>", selectedGif);

      await API.post("/messages", {
        senderId: currentUser._id,
        receiverId: userId,
        text: message,
        image: imageUrl,
        gif: selectedGif,
      });

      setMessage("");
      setSelectedImage(null);
      setImagePreview("");
      setSelectedGif(null);

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

  const deleteForMe = async (messageId) => {
    try {

      // temporary frontend delete
      setMessages((prev) =>
        prev.filter(
          (msg) => msg._id !== messageId
        )
      );


      setDeleteMsg(null);


    } catch (error) {

      console.log("DELETE FOR ME ERROR =>", error);

    }
  };

  const updateMessage = async () => {

    try {

      await API.put(
        `/messages/${editMessage._id}`,
        {
          text: editText
        }
      );

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === editMessage._id
            ? {
              ...msg,
              text: editText
            }
            : msg
        )
      );

      setEditMessage(null);
      setEditText("");

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

        <button
          className="back-btn"
          onClick={() => navigate("/messages")}
        >
          <FaArrowLeft />
        </button>


        <div className="chat-user-box">

          <div className="chat-avatar-wrapper">

            <img
              src={
                user.avatar ||
                user.profilePic ||
                "https://i.pravatar.cc/100"
              }
              alt=""
              className="chat-avatar"
            />

            <span className="chat-online-dot"></span>

          </div>


          <div className="chat-user-info">

            <h3>
              {user.username}
            </h3>

            <span>
              🟢 Online
            </span>

          </div>

        </div>


        <button className="chat-more-btn">
          ⋯
        </button>


      </div>

      <div className="messages-box">

        {messages.length === 0 ? (

          <div className="empty-chat-box">

            <div className="empty-chat-icon">
              🪁
            </div>

            <h2>
              Start chatting with {user.username}
            </h2>

            <p>
              Send messages, photos and reactions
            </p>

          </div>

        ) : (

          messages.map((msg) => {

            const isMine =
              String(msg.senderId?._id || msg.senderId) ===
              String(currentUser._id);

            return (

              <div
                key={msg._id}
                className={
                  isMine
                    ? "message-row mine"
                    : "message-row"
                }
              >

                <div className="message-wrapper">


                  <div

                    className={
                      isMine
                        ? "message-bubble mine"
                        : "message-bubble"
                    }

                    onDoubleClick={() =>
                      addReaction(msg._id, "❤️")
                    }

                    onContextMenu={(e) => {

                      e.preventDefault();

                      if (isMine) {
                        setDeleteMsg(msg);
                      }

                    }}

                  >

                    {msg.text && (

                      <p className="message-text">
                        {msg.text}
                      </p>

                    )}

                    {msg.image && (

                      <img
                        src={msg.image}
                        alt="chat"
                        className="chat-image"
                      />
                    )}

                    {msg.gif && (

                      <img
                        src={msg.gif}
                        alt="gif"
                        className="chat-gif"
                      />
                    )}

                    <div className="message-meta">


                      <span className="message-time">

                        {msg.createdAt
                          ? new Date(msg.createdAt)
                            .toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit"
                            })
                          : "10:42 PM"
                        }

                      </span>

                      {
                        isMine && (

                          <span className="read-status">

                            ✓✓

                          </span>

                        )
                      }

                    </div>

                  </div>

                  {
                    msg.reactions?.length > 0 && (

                      <div className="message-reaction-badge">

                        {
                          msg.reactions.map((r, i) => (

                            <span key={i}>
                              {r.emoji}
                            </span>

                          ))
                        }

                      </div>

                    )
                  }

                </div>

              </div>

            );

          })

        )}

        {
          typing && (

            <div className="message-row">

              <div>

                <small className="typing-text">
                  Typing...
                </small>

                <div className="typing-bubble">

                  <span></span>
                  <span></span>
                  <span></span>

                </div>

              </div>

            </div>

          )
        }

        <div ref={messagesEndRef} />

      </div>

      {imagePreview && (
        <div className="chat-preview-container">
          <img src={imagePreview || "https://placehold.co/600x400"}
            alt="preview" className="chat-preview" />

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

      {deleteMsg && (
        <div className="delete-overlay">

          <div className="delete-modal">

            <div className="delete-icon">
              🗑️
            </div>

            <h3>
              Delete Message?
            </h3>


            <p>
              Are you sure you want to delete this message?
            </p>


            <div
              className="modal-option edit-option"
              onClick={() => {

                setEditMessage(deleteMsg);

                setEditText(deleteMsg.text || "");

                setDeleteMsg(null);

              }}
            >
              ✏️ Edit Message
            </div>


            <div
              className="modal-option"
              onClick={() => {
                deleteForMe(deleteMsg._id)
              }}
            >
              🗑 Delete for me
            </div>


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

                  await API.delete(
                    `/messages/${deleteMsg._id}`
                  );

                  setMessages(prev =>
                    prev.filter(
                      m => m._id !== deleteMsg._id
                    )
                  );

                  setDeleteMsg(null);

                }}
              >
                Delete
              </button>

            </div>

          </div>

        </div>
      )}

      {
        selectedGif && (

          <div className="gif-preview">

            <img
              src={selectedGif}
              alt="gif"
            />

            <button
              onClick={() => {
                setSelectedGif(null)
              }}
            >
              ✕
            </button>

          </div>

        )
      }

      <div className="chat-input">

        {/* Emoji Button */}
        <button
          className="emoji-btn"
          onClick={(e) => {
            e.stopPropagation();
            setShowEmoji(!showEmoji);
          }}
        >
          ☺
        </button>

        {showEmoji && (
          <div
            ref={emojiRef}
            className="emoji-wrapper"
          >
            <EmojiGifPicker

              onEmoji={(emoji) => {
                setMessage(prev => prev + emoji)
              }}


              onGif={(gifUrl) => {

                console.log("CHAT RECEIVED GIF =>", gifUrl);

                setSelectedGif(gifUrl);

                setShowEmoji(false);

              }}

            />
          </div>
        )}

        {/* Image Upload */}

        <input
          type="file"
          id="chatImage"
          hidden
          accept="image/*"
          onChange={handleImageChange}
        />

        <label
          htmlFor="chatImage"
          className="image-btn"
        >
          ➕ 
        </label>

        {/* Message Input */}

        <input
          type="text"
          placeholder={
            editMessage
              ? "Edit message..."
              : "Type a message..."
          }

          value={
            editMessage
              ? editText
              : message
          }

          onChange={(e) => {

            if (editMessage) {
              setEditText(e.target.value);
            }
            else {
              setMessage(e.target.value);
            }

          }}
        />

        {/* Send / Update Button */}

        <button
          className="send-btn"
          onClick={() => {

            if (editMessage) {

              updateMessage();

            }
            else {

              sendMessage();

            }

          }}
        >
          {
            editMessage
              ? "✓"
              : "₹"
          }

        </button>

      </div>
    </div>
  );
}

export default Chat;
