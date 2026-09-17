const API_URL =
  import.meta.env.VITE_API_URL ??
  "https://carebridge-api-157552527011.us-east1.run.app/api";

export type ConversationCategory =
  | "general"
  | "appointment"
  | "medication"
  | "care"
  | "billing"
  | "system";

export type Conversation = {
  _id: string;
  patient: string;
  participantName: string;
  participantRole: string;
  participantAvatar: string;
  category: ConversationCategory;
  subject: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MessageSenderType =
  | "patient"
  | "provider"
  | "system";

export type MessageAttachment = {
  name: string;
  url: string;
  type: string;
};

export type Message = {
  _id: string;
  conversation: string;
  patient: string;
  senderType: MessageSenderType;
  senderName: string;
  body: string;
  read: boolean;
  attachment?: MessageAttachment;
  createdAt: string;
  updatedAt: string;
};

export type CreateConversationInput = {
  participantName: string;
  participantRole?: string;
  participantAvatar?: string;
  category?: ConversationCategory;
  subject: string;
  body: string;
};

export type CreateConversationResponse = {
  conversation: Conversation;
  message: Message;
};

function getToken() {
  return localStorage.getItem(
    "carebridge_token"
  );
}

function getHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
}

export async function getConversations(): Promise<
  Conversation[]
> {
  const response = await fetch(
    `${API_URL}/messages`,
    {
      headers: getHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load conversations"
    );
  }

  return response.json();
}

export async function getMessages(
  conversationId: string
): Promise<Message[]> {
  const response = await fetch(
    `${API_URL}/messages/${conversationId}`,
    {
      headers: getHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load messages"
    );
  }

  return response.json();
}

export async function createConversation(
  input: CreateConversationInput
): Promise<CreateConversationResponse> {
  const response = await fetch(
    `${API_URL}/messages`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(input),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to create conversation"
    );
  }

  return response.json();
}

export async function sendMessage(
  conversationId: string,
  body: string
): Promise<Message> {
  const response = await fetch(
    `${API_URL}/messages/${conversationId}/messages`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        body,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to send message"
    );
  }

  return response.json();
}

export async function markConversationRead(
  conversationId: string
): Promise<void> {
  const response = await fetch(
    `${API_URL}/messages/${conversationId}/read`,
    {
      method: "PATCH",
      headers: getHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to mark conversation as read"
    );
  }
}

export async function archiveConversation(
  conversationId: string
): Promise<Conversation> {
  const response = await fetch(
    `${API_URL}/messages/${conversationId}/archive`,
    {
      method: "PATCH",
      headers: getHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to archive conversation"
    );
  }

  return response.json();
}

export async function deleteMessage(
  conversationId: string,
  messageId: string
): Promise<void> {
  const response = await fetch(
    `${API_URL}/messages/${conversationId}/messages/${messageId}`,
    {
      method: "DELETE",
      headers: getHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to delete message"
    );
  }
}

export async function deleteConversation(
  conversationId: string
): Promise<void> {
  const response = await fetch(
    `${API_URL}/messages/${conversationId}`,
    {
      method: "DELETE",
      headers: getHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to delete conversation"
    );
  }
}