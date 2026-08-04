import React from "react";
import "../../styles/NotificationPanel.css";

function NotificationPanel({ notifications }) {
    return (
        <div className="notification-panel">

            <h3>🔔 Recent Notifications</h3>

            {notifications.length === 0 ? (
                <p className="no-notification">
                    No notifications yet.
                </p>
            ) : (
                notifications.map((item) => (
                    <div
                        key={item._id}
                        className="notification-card"
                    >
                        <p>{item.message}</p>

                        <span>
                            {new Date(item.createdAt).toLocaleString()}
                        </span>
                    </div>
                ))
            )}

        </div>
    );
}

export default NotificationPanel;