const express = require("express");

const {
  getAllUsers,
  getProfile,
  updateProfile,
  toggleFollow,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getAllUsers);

router.put("/follow/:id", toggleFollow);

router.get("/:id", getProfile);

router.put("/:id", updateProfile);

module.exports = router;