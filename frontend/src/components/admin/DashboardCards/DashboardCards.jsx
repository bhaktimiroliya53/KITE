import "../../../styles/admin/DashboardCard.css";

function DashboardCards({ stats }) {
    const cards = [
        {
            title: "Total Users",
            value: stats.totalUsers,
            icon: "👥",
            color: "#8b5cf6",
        },
        {
            title: "Total Posts",
            value: stats.totalPosts,
            icon: "📝",
            color: "#06b6d4",
        },
        {
            title: "Total Likes",
            value: stats.totalLikes || 0,
            icon: "❤️",
            color: "#ef4444",
        },
        {
            title: "Comments",
            value: stats.totalComments || 0,
            icon: "💬",
            color: "#22c55e",
        },
    ];

    return (
        <div className="cards-grid">
            {cards.map((card, index) => (
                <div
                    className="dashboard-card"
                    key={index}
                >
                    <div
                        className="card-icon"
                        style={{ background: card.color }}
                    >
                        {card.icon}
                    </div>

                    <div className="card-info">
                        <p>{card.title}</p>
                       <h2>{card.value}</h2>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default DashboardCards;