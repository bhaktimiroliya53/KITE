import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import kiteIcon from "../../assets/logo/kite-icon.png";
import {
    ArrowLeft,
    Search,
    Sparkles,
    Bot,
    ArrowUp,
    LockKeyhole,
    UserRound,
    FileText,
    MessageCircle,
    Bell,
    Settings,
    ShieldAlert,
    Headphones,
    ChevronRight,
} from "lucide-react";

import "../../styles/user/support.css";
import { useLoader } from "../../context/LoaderContext";

function Support() {
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();

    const [aiQuestion, setAiQuestion] = useState("");
    const [aiResponse, setAiResponse] = useState("");
    const [comingSoon, setComingSoon] = useState("");

    const handleAI = () => {
        const question = aiQuestion.trim();

        if (!question) return;

        const text = question.toLowerCase();

        if (
            text.includes("private") ||
            text.includes("privacy") ||
            text.includes("private account")
        ) {
            setAiResponse(
                "To make your KITE account private, go to Profile → Preferences → Privacy and enable Private Account."
            );
        } else if (
            text.includes("password") ||
            text.includes("change password")
        ) {
            setAiResponse(
                "You can change your password from Profile → Preferences → Security."
            );
        } else if (
            text.includes("post") ||
            text.includes("delete post") ||
            text.includes("upload")
        ) {
            setAiResponse(
                "Post management improvements are coming soon on KITE. 🚀"
            );
        } else if (
            text.includes("message") ||
            text.includes("chat") ||
            text.includes("dm")
        ) {
            setAiResponse(
                "KITE messaging is available from Connect. More advanced messaging tools are coming soon on KITE."
            );
        } else {
            setAiResponse(
                "I'm still learning about KITE. 🤖 Advanced AI support is coming soon on KITE."
            );
        }
    };

    const handleSuggestion = (question) => {
        setAiQuestion(question);
        setAiResponse("");
    };

    const quickHelp = [

        {
            icon: <LockKeyhole size={24} />,
            title: "Account",
            description: "Login & security",
            path: "/edit-profile",
        },
        {
            icon: <UserRound size={24} />,
            title: "Privacy",
            description: "Profile & privacy",
            path: "/edit-profile?tab=privacy",
        },
        {
            icon: <FileText size={24} />,
            title: "Posts",
            description: "Content & posts",
            path: "/home",
        },
        {
            icon: <MessageCircle size={24} />,
            title: "Messages",
            description: "Chat & connections",
            path: "/messages",
        },
        {
            icon: <Bell size={24} />,
            title: "Notifications",
            description: "Alerts & activity",
            comingSoon: true,
        },
        {
            icon: <Settings size={24} />,
            title: "Settings",
            description: "Preferences",
            comingSoon: true,
        },
    ];

    const popularQuestions = [
        "How do I make my account private?",
        "How do I change my password?",
        "Why can't I follow someone?",
        "How do I edit my profile?",
        "How do I delete a post?",
    ];

    return (
        <div className="support-page">

            {/* HEADER */}
            <div className="support-header">

                <button
                    className="support-back"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={20} />
                </button>

                <div>
                    <h1>KITE Support</h1>
                    <p>We're here to help you.</p>
                </div>

            </div>


            {/* AI SECTION */}
            <section className="kite-ai-card">

                <div className="ai-glow"></div>

                <div className="ai-top">

                    <div className="ai-icon">
                        <Bot size={30} />
                    </div>

                    <div>
                        <div className="ai-title">
                            <Sparkles size={17} />
                            <span>KITE AI</span>
                        </div>

                        <p className="ai-subtitle">
                            Your intelligent KITE assistant
                        </p>
                    </div>

                </div>


                <div className="ai-content">

                    <h2>
                        What can I help you with?
                    </h2>

                    <p>
                        Ask KITE about your account, privacy, posts,
                        messages or anything you're having trouble with.
                    </p>


                    {/* AI INPUT */}
                    <div className="ai-input-wrapper">

                        <Bot size={21} />

                        <input
                            type="text"
                            placeholder="Ask KITE about your problem..."
                            value={aiQuestion}
                            onChange={(e) => setAiQuestion(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleAI();
                                }
                            }}
                        />

                        <button
                            className="ai-send"
                            onClick={handleAI}
                            disabled={!aiQuestion.trim()}
                        >
                            <ArrowUp size={19} />
                        </button>

                    </div>


                    {/* AI RESPONSE */}
                    {aiResponse && (
                        <div className="ai-response">

                            <div className="ai-response-icon">
                                <Bot size={18} />
                            </div>

                            <div>
                                <span>KITE AI</span>
                                <p>{aiResponse}</p>
                            </div>

                        </div>
                    )}


                    {/* SUGGESTIONS */}
                    <div className="ai-suggestions">

                        <span>Try asking</span>

                        <div className="suggestion-list">

                            <button
                                onClick={() =>
                                    handleSuggestion("How do I make my account private?")
                                }
                            >
                                <LockKeyhole size={15} />
                                Private account
                            </button>

                            <button
                                onClick={() =>
                                    handleSuggestion("How do I edit my profile?")
                                }
                            >
                                <UserRound size={15} />
                                Profile
                            </button>

                            <button
                                onClick={() =>
                                    handleSuggestion("How do I manage my posts?")
                                }
                            >
                                <FileText size={15} />
                                Posts
                            </button>

                            <button
                                onClick={() =>
                                    handleSuggestion("How do I use messages?")
                                }
                            >
                                <MessageCircle size={15} />
                                Messages
                            </button>

                        </div>

                    </div>

                </div>


                {/* COMING SOON */}
                <div className="ai-coming-soon">
                    <Sparkles size={15} />
                    Advanced KITE AI support — Coming Soon on KITE
                </div>

            </section>


            {/* HELP SEARCH */}
            <section className="support-search-section">

                <div className="section-heading">
                    <h2>Find Your Answer</h2>
                    <p>Search anything about KITE.</p>
                </div>

                <div className="support-search">

                    <Search size={20} />

                    <input
                        type="text"
                        placeholder="Search anything about KITE..."
                    />

                </div>

            </section>


            {/* QUICK HELP */}
            <section className="quick-help-section">

                <div className="section-heading">
                    <h2>Quick Help</h2>
                    <p>Jump straight to what you need.</p>
                </div>


                <div className="quick-help-grid">

                    {quickHelp.map((item, index) => (
                        <button
                            className="quick-help-card"
                            key={index}
                            onClick={() => {
                                if (item.path) {
                                    navigate(item.path);
                                } else if (item.comingSoon) {
                                    setComingSoon(
                                        `${item.title} features are Coming Soon on KITE 🚀`
                                    );
                                }
                            }}
                        >

                            <div className="quick-help-icon">
                                {item.icon}
                            </div>

                            <div className="quick-help-info">
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            </div>

                            <ChevronRight
                                className="quick-help-arrow"
                                size={19}
                            />

                        </button>
                    ))}

                </div>
                {comingSoon && (
                    <div className="quick-help-coming-soon">
                        <Sparkles size={16} />

                        <span>{comingSoon}</span>

                        <button onClick={() => setComingSoon("")}>
                            ×
                        </button>
                    </div>
                )}

            </section>


            {/* POPULAR QUESTIONS */}
            <section className="popular-section">

                <div className="section-heading">
                    <h2>Popular on KITE</h2>
                    <p>Answers to some common questions.</p>
                </div>


                <div className="questions-card">

                    {popularQuestions.map((question, index) => (
                        <button
                            className="question-row"
                            key={index}
                            onClick={() => handleSuggestion(question)}
                        >

                            <span>{question}</span>

                            <ChevronRight size={19} />

                        </button>
                    ))}

                </div>


                <div className="questions-coming-soon">
                    <Sparkles size={15} />
                    More help articles are Coming Soon on KITE
                </div>

            </section>


            {/* STILL NEED HELP */}
            <section className="still-help-card">

                <div className="still-help-content">

                    <div className="still-help-icon">
                        <Headphones size={25} />
                    </div>

                    <div>
                        <h2>Still need help?</h2>

                        <p>
                            Our support tools are growing with KITE.
                        </p>
                    </div>

                </div>


                <div className="support-actions">

                    <button className="support-action">

                        <ShieldAlert size={19} />

                        <span>
                            Report a Problem
                            <small>Coming Soon on KITE</small>
                        </span>

                    </button>


                    <button className="support-action">

                        <MessageCircle size={19} />

                        <span>
                            Contact Support
                            <small>Coming Soon on KITE</small>
                        </span>

                    </button>

                </div>

            </section>


            {/* FOOTER */}
            <footer className="support-footer">

                <div className="footer-logo">
                    <Sparkles size={16} />
                    KITE Support
                </div>

                <p>
                    We're here to help you get the most out of KITE.
                </p>

                <span className="support-footer-coming">
                    <img src={kiteIcon} alt="KITE" />
                    More features are Coming Soon on KITE
                </span>

            </footer>

        </div>
    );
}

export default Support;