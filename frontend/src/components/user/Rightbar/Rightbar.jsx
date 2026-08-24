import React, { useState } from "react";
import "../../../styles/user/rightbar.css";

function Rightbar() {
  const [showAll, setShowAll] = useState(false);

  const trends = [
    {
      name: "#KITE",
      posts: "12.4K posts",
    },
    {
      name: "#ReactJS",
      posts: "8.7K posts",
    },
    {
      name: "#MERN",
      posts: "6.9K posts",
    },
    {
      name: "#NodeJS",
      posts: "5.2K posts",
    },
    {
      name: "#MongoDB",
      posts: "4.8K posts",
    },
    {
      name: "#ExpressJS",
      posts: "3.9K posts",
    },
    {
      name: "#JavaScript",
      posts: "3.4K posts",
    },
    {
      name: "#WebDevelopment",
      posts: "2.8K posts",
    },
  ];

  const visibleTrends = showAll ? trends : trends.slice(0, 5);

  const usersToFollow = [
    {
      name: "Alex Johnson",
      username: "@alexjohnson",
      avatar: "https://i.pravatar.cc/100?img=12",
    },
    {
      name: "Sarah Williams",
      username: "@sarahw",
      avatar: "https://i.pravatar.cc/100?img=47",
    },
    {
      name: "David Miller",
      username: "@davidmiller",
      avatar: "https://i.pravatar.cc/100?img=33",
    },
  ];

  return (
    <div className="rightbar">

      {/* ==========================================
          TRENDING TOPICS
      ========================================== */}

      <div className="trending-section">

        <h3>🔥 Trending Topics</h3>

        <div className="trends-list">
          {visibleTrends.map((trend, index) => (
            <div key={index} className="trend">

              <div className="trend-info">
                <div className="trend-name">
                  {trend.name}
                </div>

                <div className="trend-posts">
                  {trend.posts}
                </div>
              </div>

              <span className="trend-arrow">›</span>

            </div>
          ))}
        </div>

        <button
          className="view-more-btn"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show Less" : "View More"}
        </button>

      </div>


      {/* ==========================================
          WHO TO FOLLOW
      ========================================== */}

      <div className="who-to-follow">

        <h3>👥 Who to Follow</h3>

        <div className="follow-list">

          {usersToFollow.map((followUser, index) => (
            <div
              className="follow-user"
              key={index}
            >

              {/* USER INFO */}

              <div className="follow-user-info">

                <img
                  src={followUser.avatar}
                  alt={followUser.name}
                  className="follow-avatar"
                />

                <div className="follow-user-details">

                  <div className="follow-name">
                    {followUser.name}
                  </div>

                  <div className="follow-username">
                    {followUser.username}
                  </div>

                </div>

              </div>


              {/* FOLLOW BUTTON */}

              <button className="follow-btn">
                Follow
              </button>

            </div>
          ))}

        </div>

        <button className="show-more-follow">
          Show more
        </button>

      </div>


      {/* ==========================================
          FOOTER
      ========================================== */}

      <div className="rightbar-footer">

        <div className="footer-links">
          <span>About</span>
          <span>Privacy</span>
          <span>Terms</span>
          <span>Help</span>
        </div>

        <p>
          © 2026 KITE. All rights reserved.
        </p>

      </div>

    </div>
  );
}

export default Rightbar;