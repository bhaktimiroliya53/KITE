const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getMessages,
  reactToMessage,
} = require("../controllers/messageController");

router.post("/", sendMessage);

router.get("/:senderId/:receiverId", getMessages);

router.put("/react/:messageId",reactToMessage);

module.exports = router;
