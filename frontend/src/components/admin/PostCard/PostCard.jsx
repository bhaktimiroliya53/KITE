function PostCard() {
  return (
    <div className="post-card">

      <div className="post-top">

        <img
          src="https://i.pravatar.cc/50"
          alt="user"
        />

        <div>
          <h4>Parth</h4>
          <span>@kiteuser</span>
        </div>

      </div>

      <p className="post-content">
        Welcome to KITE 🚀
        This is my first post.
      </p>

      <img
        className="post-image"
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
        alt="post"
      />

      <div className="post-actions">

        <button>❤️ Like</button>

        <button>💬 Comment</button>

        <button>🔁 Repost</button>

      </div>

    </div>
  );
}

export default PostCard;