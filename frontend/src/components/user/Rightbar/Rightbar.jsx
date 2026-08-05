import React from "react";
import "../../../styles/user/rightbar.css";

function Rightbar() {
  const trends = [
    "#KITE",
    "#ReactJS",
    "#MERN",
    "#NodeJS",
    "#MongoDB",
    "#ExpressJS",
    "#JavaScript",
    "#WebDevelopment",
  ];

  return (
    <div className="rightbar">
      <h3>🔥 Trending Topics</h3>

      {trends.map((trend, index) => (
        <div key={index} className="trend">
          {trend}
        </div>
      ))}

      <button className="view-more-btn">
        View More
      </button>
    </div>
  );
}

export default Rightbar;