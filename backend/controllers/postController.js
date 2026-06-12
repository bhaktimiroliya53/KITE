const Post = require("../models/Post");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

// Create Post
exports.createPost = async (req, res) => {
  try {
    console.log("REQUEST BODY =>", req.body);

    const { content, image, userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }
    const user = await User.findById(userId);

    console.log("FOUND USER =>", user);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const newPost = new Post({
      content: content || "",
      image: image || "",
      userId,
      username: user.username || "Unknown User",
      profilePic: user.avatar || "",
    });

    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.error("CREATE POST ERROR =>", error);

    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
};
// Get All Posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("userId", "username avatar")
      .populate("likes", "username avatar")
      .populate("reposts", "username avatar")
      .sort({ _id: -1 })
      .limit(100);

    res.status(200).json(posts);
  } catch (error) {
    console.log("GET POSTS ERROR =>", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Post
exports.deletePost = async (req, res) => {
  try {

    await Post.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      message: "Post deleted",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// Toggle Like
exports.toggleLike = async (req, res) => {
  try {

    const { userId } = req.body;

    const post = await Post.findById(
      req.params.id
    );

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const alreadyLiked =
      post.likes.includes(userId);

    if (alreadyLiked) {

      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );

    } else {

      post.likes.push(userId);

    }

    await post.save();

    res.status(200).json(post);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// Toggle Comment Like
exports.toggleCommentLike = async (req, res) => {
  try {
    const { userId } = req.body;

    const post = await Post.findById(
      req.params.postId
    );

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comment =
      post.comments[req.params.commentIndex];

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (!comment.likes) {
      comment.likes = [];
    }

    const alreadyLiked =
      comment.likes.includes(userId);

    if (alreadyLiked) {
      comment.likes =
        comment.likes.filter(
          (id) => id !== userId
        );
    } else {
      comment.likes.push(userId);
    }

    await post.save();

    res.status(200).json(post);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Add Comment
exports.addComment = async (req, res) => {
  try {

    const { userId, username, avatar, text } = req.body;

    const post = await Post.findById(
      req.params.id
    );

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    post.comments.push({
      userId,
      username,
      avatar,
      text,
    });

    await post.save();

    res.status(200).json(post);

  } catch (error) {
    console.log("COMMENT ERROR =>", error);

    res.status(500).json({
      message: error.message,
    });

  }
};

// Delete Comment
exports.deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    post.comments.splice(req.params.commentIndex, 1);

    await post.save();

    res.status(200).json(post);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Toggle Repost
exports.toggleRepost = async (req, res) => {
  try {

    const { userId } = req.body;

    const post = await Post.findById(
      req.params.id
    );

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const alreadyReposted =
      post.reposts.includes(userId);

    if (alreadyReposted) {

      post.reposts = post.reposts.filter(
        (id) => id.toString() !== userId
      );

    } else {

      post.reposts.push(userId);

    }

    await post.save();

    res.status(200).json(post);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// Toggle Save
exports.toggleSave = async (req, res) => {
  try {

    const { userId } = req.body;

    const post = await Post.findById(
      req.params.id
    );

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const alreadySaved =
      post.savedBy.includes(userId);

    if (alreadySaved) {

      post.savedBy = post.savedBy.filter(
        (id) => id.toString() !== userId
      );

    } else {

      post.savedBy.push(userId);

    }

    await post.save();

    res.status(200).json(post);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// Get User Posts
exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      userId: req.params.userId,
    })
      .populate("userId", "username avatar")
      .populate("likes", "username avatar")
      .populate("reposts", "username avatar")
      .sort({ _id: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.log("GET USER POSTS ERROR =>", error);

    res.status(500).json({
      message: error.message,
    });
  }
};