import React, { useEffect, useState } from "react";
import NotificationBell from "../NotificationBell/NotificationBell";
import "../../../styles/admin/Topbar.css";
import logo from "../../../assets/logo/kite-icon.png";

function Topbar() {

    const [time, setTime] = useState(new Date());

    useEffect(() => {

        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);

    }, []);

    const hour = time.getHours();

    let greeting = "";
    let icon = "";

    if (hour >= 5 && hour < 12) {
        greeting = "Good Morning";
        icon = "🌅";
    }
    else if (hour >= 12 && hour < 17) {
        greeting = "Good Afternoon";
        icon = "☀️";
    }
    else if (hour >= 17 && hour < 21) {
        greeting = "Good Evening";
        icon = "🌇";
    }
    else {
        greeting = "Good Night";
        icon = "🌙";
    }
    return (

        <div className="topbar">

            <div className="topbar-left">

                <h1>
                    👋 {greeting}, Bhakti
                </h1>

                <p>
                    Here's what's happening across your platform today.
                </p>

            </div>

            <div className="topbar-right">

                <div className="time-card">

                    <span>Current Time</span>

                    <h2>

                        {time.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                        })}

                    </h2>

                    <small>

                        {time.toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                        })}

                    </small>

                </div>

                <NotificationBell />

                <div className="admin-profile">

                    <img
                        src={logo}
                        alt="Admin"
                    />

                    <div>

                        <h4>Bhakti</h4>

                        <span>Super Admin</span>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Topbar;