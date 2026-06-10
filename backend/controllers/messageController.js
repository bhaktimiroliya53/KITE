const Message = require("../models/Message");

exports.sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;

    const message = await Message.create({
      senderId,
      receiverId,
      text,
    });

    res.status(201).json(message);
  } catch (error) {
    console.log("SEND MESSAGE ERROR =>", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const messages = await Message.find({
      $or: [
        {
          senderId,
          receiverId,
        },
        {
          senderId: receiverId,
          receiverId: senderId,
        },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log("GET MESSAGES ERROR =>", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

exports.reactToMessage = async (req, res) => {
  try {
    const { emoji, userId } = req.body;

    const message = await Message.findById(
      req.params.messageId
    );

    if (!message) {
      return res
        .status(404)
        .json({ message: "Message not found" });
    }

    const existingReaction =
      message.reactions.find(
        (r) => String(r.userId) === String(userId)
      );

    if (existingReaction) {
      if (existingReaction.emoji === emoji) {
        message.reactions = message.reactions.filter(
          (r) => String(r.userId) !== String(userId)
        );
      } else {
        existingReaction.emoji = emoji;
      }
    } else {
      message.reactions.push({
        userId,
        emoji,
      });
    }

    await message.save();

    res.json(message);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};