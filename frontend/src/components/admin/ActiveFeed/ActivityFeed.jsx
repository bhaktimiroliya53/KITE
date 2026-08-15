import "../../../styles/admin/ActivityFeed.css";

function ActivityFeed() {
    const activities = [
        {
            id: 1,
            icon: "👤",
            text: "New user registered",
            time: "2 min ago",
        },
        {
            id: 2,
            icon: "📝",
            text: "A new post was created",
            time: "5 min ago",
        },
        {
            id: 3,
            icon: "❤️",
            text: "Post received new likes",
            time: "12 min ago",
        },
        {
            id: 4,
            icon: "🗑",
            text: "Admin deleted a post",
            time: "20 min ago",
        },
    ];

    return (
        <div className="activity-card">

            <h2>⚡ Recent Activity</h2>

            {activities.map((item) => (
                <div
                    className="activity-item"
                    key={item.id}
                >
                    <div className="activity-icon">
                        {item.icon}
                    </div>

                    <div className="activity-content">
                        <h4>{item.text}</h4>
                        <span>{item.time}</span>
                    </div>
                </div>
            ))}

        </div>
    );
}

export default ActivityFeed;