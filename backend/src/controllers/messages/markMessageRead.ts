import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../middleware/auth.js";
import { Conversation } from "../../models/Conversation.js";
import { Message } from "../../models/Message.js";

export async function markMessageRead(
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

    await Message.updateMany(
      {
        conversation: conversation._id,
        patient: req.user!.id,
        senderType: {
          $in: ["provider", "system"],
        },
        read: false,
      },
      {
        $set: {
          read: true,
        },
      }
    );

    conversation.unreadCount = 0;

    await conversation.save();

    return res.json({
      message: "Conversation marked as read",
      conversationId: conversation._id,
      unreadCount: 0,
    });
  } catch (error) {
    next(error);
  }
}