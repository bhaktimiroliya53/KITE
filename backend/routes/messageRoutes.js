const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getMessages,
  reactToMessage,
  deleteMessage,
} = require("../controllers/messageController");

router.post("/", sendMessage);

router.get("/:senderId/:receiverId", getMessages);

router.put("/react/:messageId", reactToMessage);

// 🗑 Delete Message
router.delete("/:messageId", deleteMessage);

module.exports = router;