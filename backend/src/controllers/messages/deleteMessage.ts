import type {
  Response,
  NextFunction,
} from "express";

import type {
  AuthRequest,
} from "../../middleware/auth.js";

import { Conversation } from "../../models/Conversation.js";
import { Message } from "../../models/Message.js";

export async function deleteMessage(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const conversation =
      await Conversation.findOne({
        _id: req.params.conversationId,
        patient: req.user!.id,
      });

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    const message = await Message.findOne({
      _id: req.params.messageId,
      conversation: conversation._id,
      patient: req.user!.id,
    });

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    if (message.senderType !== "patient") {
      return res.status(403).json({
        message:
          "You can only delete messages you sent",
      });
    }

    await message.deleteOne();

    const latestMessage =
      await Message.findOne({
        conversation: conversation._id,
        patient: req.user!.id,
      }).sort({
        createdAt: -1,
      });

    if (latestMessage) {
      conversation.lastMessage =
        latestMessage.body;

      conversation.lastMessageAt =
        latestMessage.createdAt;
    } else {
      conversation.lastMessage = "";
      conversation.lastMessageAt =
        conversation.createdAt;
    }

    await conversation.save();

    return res.json({
      message: "Message deleted",
      id: req.params.messageId,
    });
  } catch (error) {
    next(error);
  }
}