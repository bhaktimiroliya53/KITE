import "../../../styles/admin/LatestPosts.css";

function LatestPosts({ posts }) {
    return (
        <div className="latest-posts-card">

            <h2>🖼 Latest Posts</h2>

            {posts.slice(0, 4).map((post) => (

                <div className="latest-post" key={post._id}>

                    <img
                        src={post.image || "https://placehold.co/600x400"}
                        alt="post"
                    />

                    <div>

                        <h4>
                            {post.content || "No Caption"}
                        </h4>

                        <span>
                            @{post.username}
                        </span>

                    </div>

                </div>

            ))}

        </div>
    );
}

export default LatestPosts;