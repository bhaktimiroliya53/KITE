const User = require("../models/User");

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("followers", "username avatar")
      .populate("following", "username avatar");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedUser);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password");

    res.status(200).json(users);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// Toggle Follow
exports.toggleFollow = async (req, res) => {
  try {
    const { currentUserId } = req.body;

    const targetUser = await User.findById(req.params.id);

    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isFollowing =
      targetUser.followers.includes(currentUserId);

    if (isFollowing) {
      targetUser.followers =
        targetUser.followers.filter(
          (id) => id.toString() !== currentUserId
        );

      currentUser.following =
        currentUser.following.filter(
          (id) => id.toString() !== req.params.id
        );
    } else {
      targetUser.followers.push(currentUserId);

      currentUser.following.push(req.params.id);

    }

    await targetUser.save();
    await currentUser.save();

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log("FOLLOW ERROR =>", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Privacy & Theme
exports.updateSettings = async (req, res) => {
  try {
    const {
      privateAccount,
      showActivity,
      allowMessages,
      theme,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        privateAccount,
        showActivity,
        allowMessages,
        theme,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};