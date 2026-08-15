import "../../../styles/admin/LatestUsers.css";

function LatestUsers({ users }) {
    return (
        <div className="latest-users-card">

            <h2>👥 Latest Users</h2>

            {users.slice(0, 5).map((user) => (
                <div className="latest-user" key={user._id}>

                    <img
                        src={user.profilePic || "https://placehold.co/50x50"}
                        alt={user.username}
                    />

                    <div>
                        <h4>{user.username}</h4>
                        <span>{user.email}</span>
                    </div>

                </div>
            ))}

        </div>
    );
}

export default LatestUsers;