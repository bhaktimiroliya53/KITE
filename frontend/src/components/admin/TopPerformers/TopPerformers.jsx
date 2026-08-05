import "../../styles/TopPerformers.css";

function TopPerformers({ topUsers = [] }) {
    return (
        <div className="top-performers-card">

            <h2>🏆 Top Performers</h2>

            {topUsers.length === 0 ? (
                <p className="no-data">No data available</p>
            ) : (
                topUsers.map((user, index) => (
                    <div
                        className="performer-item"
                        key={user._id || index}
                    >
                        <div className="performer-rank">
                            {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "⭐"}
                        </div>

                        <div className="performer-info">
                            <h4>{user._id}</h4>

                            <span>
                                Posts : {user.totalPosts}
                            </span>

                            <span>
                                Likes : {user.totalLikes}
                            </span>
                        </div>

                    </div>
                ))
            )}

        </div>
    );
}

export default TopPerformers;