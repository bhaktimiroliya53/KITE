import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  AtSign,
  Sparkles,
  CheckCheck,
  LockKeyhole,
  X,
} from "lucide-react";
import { useLoader } from "../../context/LoaderContext";
import "../../styles/user/notification.css";

function Notifications() {
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();

  const [activeFilter, setActiveFilter] = useState("All");
  const [readNotifications, setReadNotifications] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("user")
    );

    if (!storedUser?._id) {
      return;
    }

    const fetchNotifications = async () => {
      showLoader();

      try {
        const response = await fetch(
          `http://localhost:8000/api/notifications/${storedUser._id}`
        );

        const data = await response.json();

        if (response.ok) {
          setNotifications(data);
        }
      } catch (error) {
        console.error(
          "FETCH NOTIFICATIONS ERROR =>",
          error
        );
      } finally {
        hideLoader();
      }
    };

    fetchNotifications();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case "follow-request":
        return <UserPlus size={21} />;

      case "like":
        return <Heart size={21} />;

      case "comment":
        return <MessageCircle size={21} />;

      case "follow":
        return <UserPlus size={21} />;

      case "mention":
        return <AtSign size={21} />;

      case "system":
        return <Bell size={21} />;

      default:
        return <Bell size={21} />;
    }
  };

  const getCategory = (type) => {
    if (type === "mention") {
      return "Mentions";
    }

    if (type === "system") {
      return "System";
    }

    return "Social";
  };

  const filteredNotifications =
    activeFilter === "All"
      ? notifications
      : notifications.filter(
        (item) =>
          getCategory(item.type) === activeFilter
      );

  const unreadCount = notifications.filter(
    (item) =>
      !item.isRead &&
      !readNotifications.includes(item._id)
  ).length;

  const markAllRead = () => {
    setReadNotifications(
      notifications.map(
        (notification) => notification._id
      )
    );
  };  

  const handleAcceptRequest = async (notification) => {
    try {
      const storedUser = JSON.parse(
        localStorage.getItem("user")
      );

      const response = await fetch(
        `http://localhost:8000/api/users/follow-request/approve/${storedUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: notification.actorId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "ACCEPT REQUEST ERROR =>",
          data
        );
        return;
      }

      // Remove notification after successful accept
      setNotifications((prev) =>
        prev.filter(
          (item) =>
            item._id !== notification._id
        )
      );

      // Also mark it as read locally
      setReadNotifications((prev) =>
        prev.filter(
          (id) => id !== notification._id
        )
      );
    } catch (error) {
      console.error(
        "ACCEPT REQUEST ERROR =>",
        error
      );
    }
  };

  const handleDeclineRequest = async (notification) => {
    try {
      const storedUser = JSON.parse(
        localStorage.getItem("user")
      );

      const response = await fetch(
        `http://localhost:8000/api/users/follow-request/reject/${storedUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: notification.actorId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "DECLINE REQUEST ERROR =>",
          data
        );
        return;
      }

      // Remove notification after successful decline
      setNotifications((prev) =>
        prev.filter(
          (item) =>
            item._id !== notification._id
        )
      );

      // Also mark it as read locally
      setReadNotifications((prev) =>
        prev.filter(
          (id) => id !== notification._id
        )
      );
    } catch (error) {
      console.error(
        "DECLINE REQUEST ERROR =>",
        error
      );
    }
  };

  return (
    <div className="pulse-page">

      {/* HEADER */}
      <header className="pulse-header">

        <button
          className="pulse-back"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
        </button>

        <div className="pulse-title-wrapper">

          <div className="pulse-title">

            <Sparkles size={19} />

            <h1>PULSE</h1>

            {unreadCount > 0 && (
              <span className="pulse-new-badge">
                {unreadCount} NEW
              </span>
            )}

          </div>

          <p>
            Your world on KITE, in motion.
          </p>

        </div>

        <button
          className="pulse-mark-read"
          onClick={markAllRead}
        >
          <CheckCheck size={17} />
          Mark all read
        </button>

      </header>


      {/* ACTIVITY SUMMARY */}
      <section className="pulse-summary">

        <div className="summary-glow"></div>

        <div className="summary-content">

          <span className="summary-label">
            GOOD EVENING 👋
          </span>

          <h2>
            Your Pulse has{" "}
            <strong>{unreadCount}</strong>{" "}
            new moments.
          </h2>

          <p>
            Here's what happened while you were away.
          </p>

        </div>

        <div className="summary-stats">

          <div>
            <Heart size={18} />
            <strong>2</strong>
            <span>Likes</span>
          </div>

          <div>
            <UserPlus size={18} />
            <strong>1</strong>
            <span>Connection</span>
          </div>

          <div>
            <MessageCircle size={18} />
            <strong>1</strong>
            <span>Comment</span>
          </div>

          <div>
            <Sparkles size={18} />
            <strong>1</strong>
            <span>Insight</span>
          </div>

        </div>

      </section>


      {/* FILTERS */}
      <section className="pulse-activity">

        <div className="pulse-section-heading">

          <div>
            <span>ACTIVITY</span>
            <h2>What's happening</h2>
          </div>

        </div>

        <div className="pulse-filters">

          {[
            "All",
            "Social",
            "Mentions",
            "System",
          ].map((filter) => (

            <button
              key={filter}
              className={
                activeFilter === filter
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveFilter(filter)
              }
            >
              {filter}
            </button>

          ))}

        </div>

      </section>


      {/* NOTIFICATION TIMELINE */}
      <section className="pulse-timeline">

        {filteredNotifications.length === 0 ? (

          <div className="pulse-empty">

            <div className="pulse-empty-icon">
              <Sparkles size={27} />
            </div>

            <h2>
              You're all caught up.
            </h2>

            <p>
              Nothing new on your Pulse.
              <br />
              Your KITE activity will appear here.
            </p>

          </div>

        ) : (

          filteredNotifications.map(
            (notification, index) => {

              const isUnread =
                !notification.isRead &&
                !readNotifications.includes(
                  notification._id
                );

              return (

                <div
                  className={`pulse-notification ${isUnread ? "unread" : ""}`}
                  key={notification._id}
                >
                  <div className="timeline-line">
                    {index !==
                      filteredNotifications.length - 1 && (
                        <span></span>
                      )}
                    <div
                      className={`timeline-dot ${isUnread ? "active" : ""
                        }`}
                    ></div>
                  </div>


                  <div className="notification-card">

                    <div
                      className={`notification-icon ${notification.type}`}
                    >
                      {getIcon(
                        notification.type
                      )}
                    </div>

                    <div className="notification-body">

                      <div className="notification-top">

                        <span className="notification-type">

                          {notification.type ===
                            "follow-request"
                            ? "FOLLOW REQUEST"
                            : notification.type ===
                              "system"
                              ? "KITE"
                              : "ACTIVITY"}

                        </span>

                        <span className="notification-time">
                          {new Date(
                            notification.createdAt
                          ).toLocaleString()}
                        </span>

                      </div>

                      <p className="notification-message">

                        <strong>
                          {notification.actorUsername ||
                            "Someone"}
                        </strong>{" "}

                        {notification.message}

                      </p>

                      {notification.preview && (

                        <p className="notification-preview">
                          "{notification.preview}"
                        </p>

                      )}


                      {/* FOLLOW REQUEST */}

                      {notification.type ===
                        "follow-request" && (

                          <div className="follow-request-info">

                            <div className="private-label">

                              <LockKeyhole
                                size={14}
                              />

                              Private account

                            </div>

                            <div className="request-actions">

                              <button
                                className="accept-btn"
                                onClick={(e) => {
                                  e.stopPropagation();

                                  handleAcceptRequest(
                                    notification
                                  );
                                }}
                              >
                                Accept
                              </button>

                              <button
                                className="decline-btn"
                                onClick={(e) => {
                                  e.stopPropagation();

                                  handleDeclineRequest(
                                    notification
                                  );
                                }}
                              >
                                Decline
                              </button>

                            </div>

                          </div>

                        )}

                    </div>

                    {isUnread && (
                      <div className="unread-dot"></div>
                    )}

                  </div>

                </div>

              );

            }
          )

        )}

      </section>


      {/* COMING SOON */}
      <section className="pulse-coming-soon">

        <div className="coming-soon-icon">
          <Sparkles size={22} />
        </div>

        <div>

          <span>KITE PULSE</span>

          <h2>
            Your activity. Your signal.
          </h2>

          <p>
            AI activity summaries · Smart alerts ·
            Personalized insights
          </p>

          <strong>
            Coming Soon on KITE
          </strong>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="pulse-footer">

        <span>
          ✦ KITE PULSE
        </span>

        <p>
          Stay connected to what matters.
        </p>

      </footer>

    </div>
  );
}

export default Notifications;