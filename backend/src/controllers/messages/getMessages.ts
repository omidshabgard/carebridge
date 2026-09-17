import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../middleware/auth.js";
import { Conversation } from "../../models/Conversation.js";
import { Message } from "../../models/Message.js";

export async function getMessages(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.conversationId,
      patient: req.user!.id,
    });

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    const messages = await Message.find({
      conversation: conversation._id,
      patient: req.user!.id,
    }).sort({
      createdAt: 1,
    });

    return res.json(messages);
  } catch (error) {
    next(error);
  }
}