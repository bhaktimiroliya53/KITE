const express = require("express");
const router = express.Router();

const {
  createPost,
  getPosts,
  getUserPosts,
  deletePost,
  toggleLike,
  addComment,
  toggleCommentLike,
  deleteComment,
  toggleRepost,
  toggleSave,
} = require("../controllers/postController");

router.post("/", createPost);
router.get("/", getPosts);
router.get("/user/:userId", getUserPosts);
router.delete("/:id", deletePost);
router.put("/like/:id", toggleLike);
router.put("/comment/:id", addComment);
router.put("/comment-like/:postId/:commentIndex",toggleCommentLike);
router.delete("/comment/:postId/:commentIndex", deleteComment);
router.put("/repost/:id", toggleRepost);
router.put("/save/:id", toggleSave);

module.exports = router;