import { useNavigate } from "react-router-dom";
import "./Create.css";

function Create() {
  const navigate = useNavigate();

  const quickCreate = [
    {
      icon: "📸",
      title: "Moment",
      description: "Share a photo or video",
      action: () => navigate("/create-post"),
    },
    {
      icon: "🎥",
      title: "Story",
      description: "Turn moments into a story",
    },
    {
      icon: "✍️",
      title: "Thought",
      description: "Share an idea or feeling",
    },
    {
      icon: "🎨",
      title: "Canvas",
      description: "Create something visual",
    },
    {
      icon: "🗳️",
      title: "Question",
      description: "Ask your community",
    },
    {
      icon: "📦",
      title: "Time Capsule",
      description: "Create something for the future",
    },
  ];

  const advancedCreate = [
    {
      icon: "🧠",
      title: "Intent",
      description: "Create with a purpose",
    },
    {
      icon: "🤝",
      title: "Collaborate",
      description: "Create something together",
    },
    {
      icon: "🪄",
      title: "AI Assist",
      description: "Let KITE help you create",
    },
    {
      icon: "🎞️",
      title: "Memory Thread",
      description: "Turn moments into a story",
    },
  ];

  return (
    <div className="create-studio">
      <div className="create-studio-header">
        <span className="create-eyebrow">KITE CREATE</span>

        <h1>
          Create something
          <span> worth remembering.</span>
        </h1>

        <p>
          Turn your ideas, moments and memories into something people
          will want to see.
        </p>
      </div>

      <section className="create-section">
        <div className="create-section-heading">
          <div>
            <span className="section-label">QUICK CREATE</span>
            <h2>Start with an idea</h2>
          </div>
        </div>

        <div className="create-grid">
          {quickCreate.map((item) => (
            <button
              key={item.title}
              className="create-option-card"
              onClick={item.action}
            >
              <div className="create-option-icon">{item.icon}</div>

              <div className="create-option-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>

              <span className="create-arrow">→</span>
            </button>
          ))}
        </div>
      </section>

      <section className="create-section">
        <div className="create-section-heading">
          <div>
            <span className="section-label">ADVANCED</span>
            <h2>Create beyond the ordinary</h2>
          </div>
        </div>

        <div className="advanced-grid">
          {advancedCreate.map((item) => (
            <button
              key={item.title}
              className="advanced-option-card"
            >
              <div className="advanced-icon">{item.icon}</div>

              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>

              <span className="create-arrow">→</span>
            </button>
          ))}
        </div>
      </section>

      <section className="create-section create-work-section">
        <div className="create-section-heading">
          <div>
            <span className="section-label">YOUR WORK</span>
            <h2>Pick up where you left off</h2>
          </div>

          <button className="view-all-button">
            View all →
          </button>
        </div>

        <div className="empty-work-card">
          <div className="empty-work-icon">✦</div>

          <h3>Your creative space is waiting</h3>

          <p>
            Your drafts and scheduled creations will appear here.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Create;