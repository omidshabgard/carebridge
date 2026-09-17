import type {
  Response,
  NextFunction,
} from "express";

import type {
  AuthRequest,
} from "../../middleware/auth.js";

import { Conversation } from "../../models/Conversation.js";
import { Message } from "../../models/Message.js";

export async function deleteConversation(
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

    await Message.deleteMany({
      conversation: conversation._id,
      patient: req.user!.id,
    });

    await conversation.deleteOne();

    return res.json({
      message:
        "Conversation deleted permanently",
      id: conversation._id,
    });
  } catch (error) {
    next(error);
  }
}