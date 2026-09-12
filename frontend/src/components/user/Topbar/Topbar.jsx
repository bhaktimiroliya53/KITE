import React, { useState, useEffect } from "react";
import { Search, Plus, Bell, Moon, Hash, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../../styles/user/topbar.css";
import kiteLogo from "../../../assets/logo/kite-icon.png";
import API from "../../../services/api";

const Topbar = ({ user }) => {
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);
  const [searchPosts, setSearchPosts] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const query = searchQuery.trim();

    if (!query) {
      setSearchUsers([]);
      setSearchPosts([]);
      setSearchLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearchLoading(true);

        const [usersResponse, postsResponse] = await Promise.all([
          API.get(
            `/users/search?q=${encodeURIComponent(query)}`
          ),
          API.get(
            `/posts/search?q=${encodeURIComponent(query)}&userId=${encodeURIComponent(
              user?._id || ""
            )}`
          ),
        ]);

        setSearchUsers(usersResponse.data || []);
        setSearchPosts(postsResponse.data || []);
      } catch (error) {
        console.error("Global search error:", error);
        setSearchUsers([]);
        setSearchPosts([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, user?._id]);

  const handleUserClick = (userId) => {
    setSearchQuery("");
    setSearchUsers([]);
    setSearchPosts([]);

    navigate(`/user/${userId}`);
  };

  const handlePostClick = (postId) => {
    setSearchQuery("");
    setSearchUsers([]);
    setSearchPosts([]);

    navigate(`/post/${postId}`);
  };

  const getPostText = (post) => {
    if (!post?.content) {
      return "Post";
    }

    return post.content.length > 90
      ? `${post.content.substring(0, 90)}...`
      : post.content;
  };

  const showHashtag =
    searchQuery.trim().startsWith("#") &&
    searchQuery.trim().length > 1;

  const hasResults =
    searchUsers.length > 0 || searchPosts.length > 0;

  return (
    <header className={`topbar ${scrolled ? "scrolled" : ""}`}>

      {/* Search */}
      <div className="topbar-search">

        <Search size={20} />

        <input
          type="text"
          placeholder="Search people, posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {searchQuery.trim() && (
          <div className="topbar-search-results">

            {searchLoading ? (
              <div className="topbar-search-message">
                Searching...
              </div>
            ) : !hasResults ? (
              <div className="topbar-search-message">
                No results found
              </div>
            ) : (
              <>

                {/* Hashtag */}
                {showHashtag && (
                  <div className="topbar-search-section-title">
                    <Hash size={14} />
                    <span>Hashtags</span>
                  </div>
                )}

                {showHashtag && searchPosts.length > 0 && (
                  <button
                    className="topbar-search-hashtag"
                    onClick={() =>
                      handlePostClick(searchPosts[0]._id)
                    }
                  >
                    <div className="topbar-search-hashtag-icon">
                      <Hash size={18} />
                    </div>

                    <div className="topbar-search-user-info">
                      <span>
                        #{searchQuery.trim().substring(1)}
                      </span>

                      <small>
                        {searchPosts.length} post
                        {searchPosts.length !== 1 ? "s" : ""}
                      </small>
                    </div>
                  </button>
                )}

                {/* People */}
                {searchUsers.length > 0 && (
                  <>
                    <div className="topbar-search-section-title">
                      <span>People</span>
                    </div>

                    {searchUsers.map((searchedUser) => (
                      <button
                        key={searchedUser._id}
                        className="topbar-search-user"
                        onClick={() =>
                          handleUserClick(searchedUser._id)
                        }
                      >
                        <img
                          src={
                            searchedUser.avatar ||
                            "https://i.pravatar.cc/150"
                          }
                          alt={searchedUser.username}
                        />

                        <div className="topbar-search-user-info">
                          <span>
                            {searchedUser.username}
                          </span>

                          {searchedUser.bio && (
                            <small>
                              {searchedUser.bio}
                            </small>
                          )}
                        </div>
                      </button>
                    ))}
                  </>
                )}

                {/* Posts */}
                {searchPosts.length > 0 && (
                  <>
                    <div className="topbar-search-section-title">
                      <FileText size={14} />
                      <span>Posts</span>
                    </div>

                    {searchPosts.map((post) => (
                      <button
                        key={post._id}
                        className="topbar-search-post"
                        onClick={() =>
                          handlePostClick(post._id)
                        }
                      >
                        <div className="topbar-search-post-icon">
                          <FileText size={18} />
                        </div>

                        <div className="topbar-search-post-info">
                          <span>
                            {post.username ||
                              post.userId?.username ||
                              "User"}
                          </span>

                          <small>
                            {getPostText(post)}
                          </small>
                        </div>
                      </button>
                    ))}
                  </>
                )}

              </>
            )}

          </div>
        )}

      </div>


      {/* KITE Logo */}
      <div className="topbar-logo">

        <img
          src={kiteLogo}
          alt="KITE"
        />

      </div>


      {/* Actions */}
      <div className="topbar-actions">

        <button className="topbar-action">
          <Plus size={22} />
        </button>

        <button className="topbar-action">
          <Bell size={21} />
        </button>

        <button className="topbar-action">
          <Moon size={21} />
        </button>


        {/* Profile */}
        <div className="topbar-profile">

          <img
            src={
              user?.avatar ||
              user?.profilePic ||
              user?.profileImage ||
              "https://i.pravatar.cc/150"
            }
            alt="Profile"
          />

        </div>

      </div>

    </header>
  );
};

export default Topbar;