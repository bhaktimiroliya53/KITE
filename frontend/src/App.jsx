import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import EditProfile from "./pages/Profile/EditProfile";
import Search from "./pages/Search/Search";
import Messages from "./pages/Messages/Messages";
import Notifications from "./pages/Notification/Notifications";
import SavedPosts from "./pages/SavedPosts/SavedPosts";
import UserProfile from "./pages/UserProfile/UserProfile";
import Explore from "./pages/Explore/Explore";
import Chat from "./pages/Chat/Chat";
import PostView from "./pages/PostView/PostView";
import Support from "./pages/Support/Support";
import Create from "./pages/Create/Create"; 
import CreatePost from "./components/user/CreatePost/CreatePost";

import AdminDashboard from "./pages/Admin/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User */}
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/search" element={<Search />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/notification" element={<Notifications />} />
        <Route path="/saved" element={<SavedPosts />} />
        <Route path="/saved-posts" element={<SavedPosts />} />
        <Route path="/user/:id" element={<UserProfile />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/chat/:userId" element={<Chat />} />
        <Route path="/post/:id" element={<PostView />} />
        <Route path="/support" element={<Support />} />
        <Route path="/create" element={<Create />} />
        <Route path="/create-post" element={<CreatePost />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;