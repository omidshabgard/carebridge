import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../middleware/auth.js";
import { Conversation } from "../../models/Conversation.js";

export async function archiveConversation(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const conversation = await Conversation.findOneAndUpdate(
      {
        _id: req.params.conversationId,
        patient: req.user!.id,
      },
      {
        $set: {
          archived: true,
        },
      },
      {
        new: true,
      }
    );

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    return res.json(conversation);
  } catch (error) {
    next(error);
  }
}