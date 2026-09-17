import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../middleware/auth.js";
import { Conversation } from "../../models/Conversation.js";

export async function getConversations(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const conversations = await Conversation.find({
      patient: req.user!.id,
    }).sort({
      lastMessageAt: -1,
      createdAt: -1,
    });

    return res.json(conversations);
  } catch (error) {
    next(error);
  }
}