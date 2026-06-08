import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import SavedPosts from "./pages/SavedPosts";
import Search from "./pages/Search";
import UserProfile from "./pages/UserProfile";
import PostView from "./pages/PostView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/home" element={<Home />} />

        <Route path="/create-post" element={<CreatePost />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/edit-profile" element={<EditProfile />} />

        <Route path="/saved-posts" element={<SavedPosts />} />

        <Route path="/search" element={<Search />} />

        <Route path="/user/:id" element={<UserProfile />} />

        <Route path="/post/:id" element={<PostView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
