import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../middleware/auth.js";
import { Conversation } from "../../models/Conversation.js";
import { Message } from "../../models/Message.js";

export async function sendMessage(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { body } = req.body;

    if (!body?.trim()) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const conversation = await Conversation.findOne({
      _id: req.params.conversationId,
      patient: req.user!.id,
    });

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    const message = await Message.create({
      conversation: conversation._id,
      patient: req.user!.id,
      senderType: "patient",
      senderName: "You",
      body: body.trim(),
      read: true,
    });

    conversation.lastMessage = body.trim();
    conversation.lastMessageAt = new Date();
    conversation.archived = false;

    await conversation.save();

    return res.status(201).json(message);
  } catch (error) {
    next(error);
  }
}