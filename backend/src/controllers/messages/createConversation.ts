import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../middleware/auth.js";
import { Conversation } from "../../models/Conversation.js";
import { Message } from "../../models/Message.js";

export async function createConversation(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      participantName,
      participantRole,
      participantAvatar,
      category,
      subject,
      body,
    } = req.body;

    if (!participantName?.trim()) {
      return res.status(400).json({
        message: "Recipient is required",
      });
    }

    if (!subject?.trim()) {
      return res.status(400).json({
        message: "Subject is required",
      });
    }

    if (!body?.trim()) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const conversation = await Conversation.create({
      patient: req.user!.id,
      participantName: participantName.trim(),
      participantRole:
        participantRole?.trim() || "Care team",
      participantAvatar:
        participantAvatar?.trim() || "",
      category: category || "general",
      subject: subject.trim(),
      lastMessage: body.trim(),
      lastMessageAt: new Date(),
      unreadCount: 0,
      archived: false,
    });

    const message = await Message.create({
      conversation: conversation._id,
      patient: req.user!.id,
      senderType: "patient",
      senderName: "You",
      body: body.trim(),
      read: true,
    });

    return res.status(201).json({
      conversation,
      message,
    });
  } catch (error) {
    next(error);
  }
}