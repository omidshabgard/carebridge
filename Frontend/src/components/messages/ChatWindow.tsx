import {
  Archive,
  MoreHorizontal,
  Phone,
  ShieldCheck,
  Trash2,
  Video,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  Conversation,
  Message,
} from "../../services/messageService";

import MessageBubble from "./MessageBubble";
import MessageComposer from "./MessageComposer";
import TypingIndicator from "./TypingIndicator";

type ChatWindowProps = {
  conversation: Conversation;
  messages: Message[];
  loading: boolean;
  typing: boolean;
  onSend: (body: string) => Promise<void>;
  onArchive: () => Promise<void>;
  onDeleteMessage: (
    message: Message
  ) => Promise<void>;
  onDeleteConversation: () => Promise<void>;
};

const QUICK_REPLIES = [
  "Thank you! 😊",
  "Sounds good 👍",
  "I have a question",
  "Can we schedule a follow-up?",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function ChatWindow({
  conversation,
  messages,
  loading,
  typing,
  onSend,
  onArchive,
  onDeleteMessage,
  onDeleteConversation,
}: ChatWindowProps) {
  const bottomRef =
    useRef<HTMLDivElement | null>(null);

  const menuRef =
    useRef<HTMLDivElement | null>(null);

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [deletingConversation, setDeletingConversation] =
    useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, typing]);

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent
    ) {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  async function handleDeleteConversation() {
    if (deletingConversation) {
      return;
    }

    const confirmed = window.confirm(
      "Permanently delete this conversation and all messages? This cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingConversation(true);

      await onDeleteConversation();

      setMenuOpen(false);
    } catch {
      window.alert(
        "Unable to delete this conversation."
      );
    } finally {
      setDeletingConversation(false);
    }
  }

  return (
    <section className="chat-window">
      <header className="chat-window-header">
        <div className="chat-contact">
          <div className="chat-contact-avatar">
            {conversation.participantAvatar ? (
              <img
                src={
                  conversation.participantAvatar
                }
                alt=""
              />
            ) : (
              <span>
                {getInitials(
                  conversation.participantName
                )}
              </span>
            )}
          </div>

          <div>
            <h3>
              {conversation.participantName}
            </h3>

            <p>
              {conversation.participantRole}
            </p>

            <span className="chat-secure-label">
              <ShieldCheck size={13} />
              Secure conversation
            </span>
          </div>
        </div>

        <div className="chat-header-actions">
          <button
            type="button"
            aria-label="Start phone call"
            title="Calling coming soon"
          >
            <Phone size={18} />
          </button>

          <button
            type="button"
            aria-label="Start video call"
            title="Video visits coming soon"
          >
            <Video size={18} />
          </button>

          <button
            type="button"
            onClick={() => void onArchive()}
            aria-label="Archive conversation"
            title="Archive conversation"
          >
            <Archive size={18} />
          </button>

          <div
            className="chat-more-menu"
            ref={menuRef}
          >
            <button
              type="button"
              aria-label="More options"
              onClick={() =>
                setMenuOpen(
                  (current) => !current
                )
              }
            >
              <MoreHorizontal size={19} />
            </button>

            {menuOpen && (
              <div className="chat-more-dropdown">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    void onArchive();
                  }}
                >
                  <Archive size={16} />
                  Archive conversation
                </button>

                <button
                  type="button"
                  className="message-delete-option"
                  disabled={
                    deletingConversation
                  }
                  onClick={() =>
                    void handleDeleteConversation()
                  }
                >
                  <Trash2 size={16} />

                  {deletingConversation
                    ? "Deleting..."
                    : "Delete conversation"}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="chat-subject-bar">
        <div>
          <span>Subject</span>

          <strong>
            {conversation.subject}
          </strong>
        </div>

        <span
          className={`chat-category chat-category-${conversation.category}`}
        >
          {conversation.category}
        </span>
      </div>

      <div className="chat-message-area">
        {loading ? (
          <div className="chat-loading">
            Loading conversation...
          </div>
        ) : messages.length ? (
          messages.map((message) => (
            <MessageBubble
              key={message._id}
              message={message}
              onDelete={onDeleteMessage}
            />
          ))
        ) : (
          <div className="chat-empty">
            <strong>
              Start the conversation
            </strong>

            <p>
              Send a secure message to your
              care team.
            </p>
          </div>
        )}

        <TypingIndicator
          name={
            conversation.participantName
          }
          visible={typing}
        />

        <div ref={bottomRef} />
      </div>

      <div className="message-quick-replies">
        <span>Quick replies</span>

        <div>
          {QUICK_REPLIES.map((reply) => (
            <button
              key={reply}
              type="button"
              onClick={() =>
                void onSend(reply)
              }
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      <MessageComposer
        onSend={onSend}
        disabled={loading}
      />
    </section>
  );
}

export default ChatWindow;