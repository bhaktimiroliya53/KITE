import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Profile from "./pages/Profile/Profile";
import EditProfile from "./pages/Profile/EditProfile";
import Search from "./pages/Search/Search";
import Chat from "./pages/Chat/Chat";
import Notifications from "./pages/Notification/Notifications";
import SavedPosts from "./pages/SavedPosts/SavedPosts";
import UserProfile from "./pages/UserProfile/UserProfile";
import Explore from "./pages/Explore/Explore";
import PostView from "./pages/PostView/PostView";
import Messages from "./pages/Messages/Messages";

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

        <Route path="/messages" element={<Messages />} />

        <Route path="/chat/:userId" element={<Chat />} />

        <Route path="/admin" element={<AdminDashboard />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
