import { MessageSquarePlus } from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  archiveConversation as archiveConversationApi,
  createConversation as createConversationApi,
  deleteConversation as deleteConversationApi,
  deleteMessage as deleteMessageApi,
  getConversations,
  getMessages,
  markConversationRead,
  sendMessage as sendMessageApi,
  type Conversation,
  type CreateConversationInput,
  type Message,
} from "../../services/messageService";

import ChatWindow from "./ChatWindow";
import ContactPanel from "./ContactPanel";
import ConversationList from "./ConversationList";
import NewMessageForm from "./NewMessageForm";

type MessagesProps = {
  show?: (message: string) => void;
  onMessageActivity?: () => void;
};

function Messages({
  show,
  onMessageActivity,
}: MessagesProps) {
  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [
    selectedConversation,
    setSelectedConversation,
  ] = useState<Conversation | null>(null);

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [
    loadingConversations,
    setLoadingConversations,
  ] = useState(true);

  const [
    loadingMessages,
    setLoadingMessages,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [
    creatingNewMessage,
    setCreatingNewMessage,
  ] = useState(false);

  const loadConversations =
    useCallback(async () => {
      try {
        setError("");

        const data =
          await getConversations();

        setConversations(data);

        setSelectedConversation(
          (current) => {
            if (!data.length) {
              return null;
            }

            if (current) {
              const updated =
                data.find(
                  (conversation) =>
                    conversation._id ===
                    current._id
                );

              if (updated) {
                return updated;
              }
            }

            return (
              data.find(
                (conversation) =>
                  !conversation.archived
              ) ?? data[0]
            );
          }
        );
      } catch {
        setError(
          "Unable to load your conversations."
        );
      } finally {
        setLoadingConversations(false);
      }
    }, []);

  useEffect(() => {
    void loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (!selectedConversation) {
      setMessages([]);
      return;
    }

    let active = true;

    async function loadSelectedConversation() {
      try {
        setLoadingMessages(true);
        setError("");

        const data =
          await getMessages(
            selectedConversation!._id
          );

        if (!active) {
          return;
        }

        setMessages(data);

        if (
          selectedConversation!
            .unreadCount > 0
        ) {
          await markConversationRead(
            selectedConversation!._id
          );

          if (!active) {
            return;
          }

          setConversations(
            (current) =>
              current.map(
                (conversation) =>
                  conversation._id ===
                  selectedConversation!._id
                    ? {
                        ...conversation,
                        unreadCount: 0,
                      }
                    : conversation
              )
          );

          setSelectedConversation(
            (current) =>
              current
                ? {
                    ...current,
                    unreadCount: 0,
                  }
                : current
          );

          onMessageActivity?.();
        }
      } catch {
        if (active) {
          setError(
            "Unable to load this conversation."
          );
        }
      } finally {
        if (active) {
          setLoadingMessages(false);
        }
      }
    }

    void loadSelectedConversation();

    return () => {
      active = false;
    };
  }, [selectedConversation?._id]);

  function handleSelectConversation(
    conversation: Conversation
  ) {
    setCreatingNewMessage(false);

    setSelectedConversation(
      conversation
    );
  }

  async function handleCreateConversation(
    input: CreateConversationInput
  ) {
    try {
      setError("");

      const result =
        await createConversationApi(
          input
        );

      const newConversation =
        result.conversation;

      setConversations(
        (current) => [
          newConversation,
          ...current,
        ]
      );

      setSelectedConversation(
        newConversation
      );

      setMessages([
        result.message,
      ]);

      setCreatingNewMessage(false);

      show?.(
        "Message sent successfully."
      );

      onMessageActivity?.();
    } catch {
      throw new Error(
        "Unable to create conversation"
      );
    }
  }

  async function handleSend(
    body: string
  ) {
    if (!selectedConversation) {
      return;
    }

    try {
      setError("");

      const newMessage =
        await sendMessageApi(
          selectedConversation._id,
          body
        );

      setMessages(
        (current) => [
          ...current,
          newMessage,
        ]
      );

      const updatedConversation: Conversation =
        {
          ...selectedConversation,
          lastMessage: body,
          lastMessageAt:
            newMessage.createdAt,
          archived: false,
        };

      setSelectedConversation(
        updatedConversation
      );

      setConversations(
        (current) => {
          const remaining =
            current.filter(
              (conversation) =>
                conversation._id !==
                updatedConversation._id
            );

          return [
            updatedConversation,
            ...remaining,
          ];
        }
      );

      onMessageActivity?.();
    } catch {
      setError(
        "Unable to send your message."
      );

      throw new Error(
        "Unable to send message"
      );
    }
  }

  async function handleDeleteMessage(
    message: Message
  ) {
    if (!selectedConversation) {
      return;
    }

    await deleteMessageApi(
      selectedConversation._id,
      message._id
    );

    const remainingMessages =
      messages.filter(
        (currentMessage) =>
          currentMessage._id !==
          message._id
      );

    setMessages(
      remainingMessages
    );

    const latestMessage =
      remainingMessages[
        remainingMessages.length - 1
      ];

    const updatedConversation: Conversation =
      {
        ...selectedConversation,
        lastMessage:
          latestMessage?.body ?? "",
        lastMessageAt:
          latestMessage?.createdAt ??
          selectedConversation.createdAt,
      };

    setSelectedConversation(
      updatedConversation
    );

    setConversations(
      (current) =>
        current.map(
          (conversation) =>
            conversation._id ===
            updatedConversation._id
              ? updatedConversation
              : conversation
        )
    );

    show?.(
      "Message deleted."
    );

    onMessageActivity?.();
  }

  async function handleArchive() {
    if (!selectedConversation) {
      return;
    }

    try {
      const updated =
        await archiveConversationApi(
          selectedConversation._id
        );

      const updatedConversations =
        conversations.map(
          (conversation) =>
            conversation._id ===
            updated._id
              ? updated
              : conversation
        );

      setConversations(
        updatedConversations
      );

      const nextConversation =
        updatedConversations.find(
          (conversation) =>
            conversation._id !==
              updated._id &&
            !conversation.archived
        ) ?? null;

      setSelectedConversation(
        nextConversation
      );

      setMessages([]);

      show?.(
        "Conversation archived."
      );

      onMessageActivity?.();
    } catch {
      setError(
        "Unable to archive this conversation."
      );

      throw new Error(
        "Unable to archive conversation"
      );
    }
  }

  async function handleDeleteConversation() {
    if (!selectedConversation) {
      return;
    }

    const deletingId =
      selectedConversation._id;

    await deleteConversationApi(
      deletingId
    );

    const remaining =
      conversations.filter(
        (conversation) =>
          conversation._id !==
          deletingId
      );

    setConversations(
      remaining
    );

    const nextConversation =
      remaining.find(
        (conversation) =>
          !conversation.archived
      ) ??
      remaining[0] ??
      null;

    setSelectedConversation(
      nextConversation
    );

    setMessages([]);

    show?.(
      "Conversation deleted permanently."
    );

    onMessageActivity?.();
  }

  if (loadingConversations) {
    return (
      <div className="messages-loading-screen">
        <div className="messages-loading-card">
          <span className="messages-loading-dot" />

          <strong>
            Loading secure messages...
          </strong>
        </div>
      </div>
    );
  }

  if (creatingNewMessage) {
    return (
      <NewMessageForm
        onClose={() =>
          setCreatingNewMessage(
            false
          )
        }
        onCreate={
          handleCreateConversation
        }
      />
    );
  }

  return (
    <div className="messages-page">
      {error && (
        <div
          className="messages-error"
          role="alert"
        >
          <span>{error}</span>

          <button
            type="button"
            onClick={() => {
              setError("");
              void loadConversations();
            }}
          >
            Try again
          </button>
        </div>
      )}

      <div className="messages-workspace">
        <ConversationList
          conversations={
            conversations
          }
          selectedId={
            selectedConversation?._id ??
            null
          }
          onSelect={
            handleSelectConversation
          }
          onNewMessage={() =>
            setCreatingNewMessage(
              true
            )
          }
        />

        {selectedConversation ? (
          <>
            <ChatWindow
              conversation={
                selectedConversation
              }
              messages={messages}
              loading={
                loadingMessages
              }
              typing={false}
              onSend={handleSend}
              onArchive={
                handleArchive
              }
              onDeleteMessage={
                handleDeleteMessage
              }
              onDeleteConversation={
                handleDeleteConversation
              }
            />

            <ContactPanel
              conversation={
                selectedConversation
              }
            />
          </>
        ) : (
          <section className="messages-empty-workspace">
            <div className="messages-empty-icon">
              <MessageSquarePlus
                size={34}
              />
            </div>

            <h2>
              Your secure messages
            </h2>

            <p>
              Start a conversation with
              your CareBridge care team.
            </p>

            <button
              type="button"
              onClick={() =>
                setCreatingNewMessage(
                  true
                )
              }
            >
              <MessageSquarePlus
                size={18}
              />
              New message
            </button>
          </section>
        )}
      </div>
    </div>
  );
}

export default Messages;