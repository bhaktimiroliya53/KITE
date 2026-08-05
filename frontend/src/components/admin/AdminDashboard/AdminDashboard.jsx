import React, { useEffect, useState, useRef } from "react";
import API from "../../services/api";

import "../../styles/admin/AdminDashboard.css";

import Sidebar from "../../components/admin/Sidebar/Sidebar";
import Topbar from "../../components/admin/Topbar/Topbar";
import DashboardCards from "../../components/admin/DashboardCards/DashboardCards";
import Charts from "../../components/admin/Charts/Charts";
import ActivityFeed from "../../components/admin/ActiveFeed/ActivityFeed";
import LatestUsers from "../../components/admin/LatestUsers/LatestUsers";
import LatestPosts from "../../components/admin/LatestPost/LatestPosts";
import TopPerformers from "../../components/admin/TopPerformers/TopPerformers";
import NotificationPanel from "../../components/admin/Notificationpanel/NotificationPanel";
import Topbar from "../Topbar/Topbar";


function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalPosts: 0,
    });

    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [searchUser, setSearchUser] = useState("");
    const [searchPost, setSearchPost] = useState("");
    const [analytics, setAnalytics] = useState({
        topUsers: [],
        trendingPost: null,
    });

    const [notifications, setNotifications] = useState([]);

    const dashboardRef = useRef(null);
    const usersRef = useRef(null);
    const postsRef = useRef(null);
    const analyticsRef = useRef(null);
    const settingsRef = useRef(null);

    const scrollToSection = (section) => {
        const refs = {
            dashboard: dashboardRef,
            users: usersRef,
            posts: postsRef,
            analytics: analyticsRef,
            settings: settingsRef,
        };
        refs[section]?.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        fetchDashboard();
        fetchUsers();
        fetchPosts();
    }, []);

    const fetchDashboard = async () => {
        try {
            const res = await API.post("/admin/dashboard", {
                userId: user._id,
            });

            setStats(res.data);

            const analyticsRes = await API.get("/admin/analytics", {
                params: {
                    userId: user._id,
                },
            });

            setAnalytics({
                topUsers: analyticsRes.data.topUsers || [],
                trendingPost: analyticsRes.data.trendingPost || null,
            });

            const notificationRes = await API.get("/admin/notifications", {
                params: {
                    userId: user._id,
                },
            });

            setNotifications(notificationRes.data);

        } catch (err) {
            console.log("ERROR:", err);
            console.log("STATUS:", err.response?.status);
            console.log("DATA:", err.response?.data);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await API.post("/admin/users", {
                userId: user._id,
            });

            setUsers(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchPosts = async () => {
        try {
            const res = await API.post("/admin/posts", {
                userId: user._id,
            });

            setPosts(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteUser = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmDelete) return;

        try {
            await API.delete(`/admin/users/${id}`, {
                data: {
                    userId: user._id,
                },
            });

            alert("User deleted successfully!");

            fetchUsers();
            fetchDashboard();
        } catch (err) {
            console.log(err);
            alert("Failed to delete user");
        }
    };

    const deletePost = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this post?"
        );

        if (!confirmDelete) return;

        try {
            await API.delete(`/admin/posts/${id}`, {
                data: {
                    userId: user._id,
                },
            });

            alert("Post deleted successfully!");

            fetchPosts();
            fetchDashboard();
        } catch (err) {
            console.log(err);
            alert("Failed to delete post");
        }
    };
    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        window.location.href = "/";
    };

    return (
        <div style={{ display: "flex" }}>

            <Sidebar onNavigate={scrollToSection} />

            <div
                className="admin-page"
                ref={dashboardRef}
            >

                <Topbar />

                <div ref={analyticsRef}></div>

                <DashboardCards stats={stats} />

                <div className="dashboard-grid">

                    <div className="left-panel">

                        <Charts />

                    </div>

                    <div className="right-panel">

                        <ActivityFeed />

                        <LatestUsers users={users} />

                        <LatestPosts posts={posts} />

                        <TopPerformers topUsers={analytics.topUsers} />

                        <NotificationPanel notifications={notifications} />

                    </div>

                </div>

                <h2
                    className="users-title"
                    ref={usersRef}
                >👥 Users Management</h2>

                <input
                    type="text"
                    placeholder="🔍 Search User..."
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    className="search-input"
                />

                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Avatar</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users
                            .filter((item) =>
                                item.username
                                    .toLowerCase()
                                    .includes(searchUser.toLowerCase())
                            )
                            .map((item) => (
                                <tr key={item._id}>
                                    <td>
                                        <img
                                            src={item.avatar}
                                            alt={item.username}
                                            className="user-avatar"
                                        />
                                    </td>

                                    <td>{item.username}</td>

                                    <td>{item.email}</td>

                                    <td>
                                        <span
                                            className={
                                                item.role === "admin"
                                                    ? "role-admin"
                                                    : "role-user"
                                            }
                                        >
                                            {item.role}
                                        </span>
                                    </td>

                                    <td>
                                        <button
                                            className="delete-btn"
                                            disabled={item.role === "admin"}
                                            onClick={() => deleteUser(item._id)}
                                        >
                                            🗑 Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>

                <h2
                    className="users-title"
                    style={{ marginTop: "60px" }}
                    ref={postsRef}
                >
                    🖼 Posts Management
                </h2>

                <input
                    type="text"
                    placeholder="🔍 Search Post..."
                    value={searchPost}
                    onChange={(e) => setSearchPost(e.target.value)}
                    className="search-input"
                />

                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Caption</th>
                            <th>Posted By</th>
                            <th>Likes</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts
                            .filter((post) =>
                                post.content
                                    .toLowerCase()
                                    .includes(searchPost.toLowerCase())
                            )
                            .map((post) => (
                                <tr key={post._id}>
                                    <td>
                                        {post.image ? (
                                            <img
                                                src={post.image}
                                                alt="Post"
                                                style={{
                                                    width: "80px",
                                                    height: "80px",
                                                    objectFit: "cover",
                                                    borderRadius: "10px",
                                                }}
                                            />
                                        ) : (
                                            "No Image"
                                        )}
                                    </td>

                                    <td
                                        style={{
                                            maxWidth: "250px",
                                            wordBreak: "break-word",
                                        }}
                                    >
                                        {post.content || "No Caption"}
                                    </td>

                                    <td>{post.username}</td>

                                    <td>❤️ {post.likes.length}</td>

                                    <td>
                                        <button
                                            className="delete-btn"
                                            onClick={() => deletePost(post._id)}
                                        >
                                            🗑 Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>

                <div
                    ref={settingsRef}
                    style={{
                        marginTop: "70px",
                        padding: "30px",
                        background: "rgba(255,255,255,.05)",
                        borderRadius: "20px",
                        border: "1px solid rgba(255,255,255,.08)",
                    }}
                >
                    <h2>⚙ Settings</h2>

                    <div className="settings-container">

                        <label className="setting-item">
                            <span>🌙 Dark Mode</span>
                            <input type="checkbox" defaultChecked />
                        </label>

                        <label className="setting-item">
                            <span>🔔 Notifications</span>
                            <input type="checkbox" defaultChecked />
                        </label>

                        <label className="setting-item">
                            <span>🟢 Show Online Status</span>
                            <input type="checkbox" defaultChecked />
                        </label>

                        <label className="setting-item">
                            <span>🛡 Maintenance Mode</span>
                            <input type="checkbox" />
                        </label>

                        <button className="save-settings-btn">
                            💾 Save Settings
                        </button>

                    </div>
                </div>
            </div >
        </div>


    );

}

export default AdminDashboard;