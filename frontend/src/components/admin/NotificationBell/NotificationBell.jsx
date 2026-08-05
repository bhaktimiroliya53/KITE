import { Bell, CheckCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import API from "../../../services/api";
import "../../styles/NotificationBell.css";

function NotificationBell() {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"));
    const socket = io("http://localhost:8000");
    useEffect(() => {

        fetchNotifications();

        socket.emit("join", user._id);

        socket.on("newNotification", (notification) => {

            setNotifications((prev) => [
                notification,
                ...prev,
            ]);

        });

        return () => {

            socket.off("newNotification");

        };
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await API.get("/admin/notifications", {
                params: {
                    userId: user._id,
                },
            });

            setNotifications(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case "user":
                return "👤";
            case "post":
                return "📝";
            case "delete":
                return "🗑️";
            case "report":
                return "🚨";
            default:
                return "🔔";
        }
    };

    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);

        if (seconds < 60) return "Just now";

        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} min ago`;

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hr ago`;

        const days = Math.floor(hours / 24);
        return `${days} day ago`;
    };

    return (
        <div className="notification-box">

            <button
                className="bell-btn"
                onClick={() => setOpen(!open)}
            >
                <Bell size={21} />

                {notifications.length > 0 && (
                    <span className="notification-badge">
                        {notifications.length}
                    </span>
                )}
            </button>

            {open && (

                <div className="notification-dropdown">

                    <div className="notification-header">

                        <h3>🔔 Notifications</h3>

                        <button className="clear-btn">
                            <CheckCheck size={16} />
                            Mark all
                        </button>

                    </div>

                    <div className="notification-list">

                        {notifications.length === 0 ? (

                            <div className="empty-state">
                                <h4>No Notifications</h4>
                                <p>Everything looks good 🎉</p>
                            </div>

                        ) : (

                            notifications.map((item) => (

                                <div
                                    key={item._id}
                                    className="notification-item"
                                >

                                    <div className="notification-icon">
                                        {getIcon(item.type)}
                                    </div>

                                    <div className="notification-content">

                                        <h4>
                                            {item.message}
                                        </h4>

                                        <span>
                                            {timeAgo(item.createdAt)}
                                        </span>

                                    </div>

                                </div>

                            ))

                        )}

                    </div>

                    <div className="notification-footer">
                        View All Notifications →
                    </div>

                </div>

            )}

        </div>
    );
}

export default NotificationBell;