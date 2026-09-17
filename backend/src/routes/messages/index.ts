import { Router } from "express";

import { requireAuth } from "../../middleware/auth.js";

import { getConversations } from "../../controllers/messages/getConversations.js";
import { getMessages } from "../../controllers/messages/getMessages.js";
import { createConversation } from "../../controllers/messages/createConversation.js";
import { sendMessage } from "../../controllers/messages/sendMessage.js";
import { markMessageRead } from "../../controllers/messages/markMessageRead.js";
import { archiveConversation } from "../../controllers/messages/archiveConversation.js";
import { deleteMessage } from "../../controllers/messages/deleteMessage.js";
import { deleteConversation } from "../../controllers/messages/deleteConversation.js";

const router = Router();

router.use(requireAuth);

// GET all conversations
router.get("/", getConversations);

// CREATE a new conversation with the first message
router.post("/", createConversation);

// GET messages inside one conversation
router.get("/:conversationId", getMessages);

// SEND a message inside an existing conversation
router.post(
  "/:conversationId/messages",
  sendMessage
);

// MARK conversation messages as read
router.patch(
  "/:conversationId/read",
  markMessageRead
);

// ARCHIVE conversation
router.patch(
  "/:conversationId/archive",
  archiveConversation
);

// DELETE one patient-sent message
router.delete(
  "/:conversationId/messages/:messageId",
  deleteMessage
);

// DELETE entire conversation and its messages
router.delete(
  "/:conversationId",
  deleteConversation
);

export default router;