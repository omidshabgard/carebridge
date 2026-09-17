import {
  Archive,
  Inbox,
  MessageSquarePlus,
  Search,
  Send,
} from "lucide-react";
import { useMemo, useState } from "react";

import type {
  Conversation,
} from "../../services/messageService";

export type MessageFilter =
  | "all"
  | "unread"
  | "sent"
  | "archived";

type ConversationListProps = {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (conversation: Conversation) => void;
  onNewMessage: () => void;
};

function formatConversationTime(date: string) {
  const messageDate = new Date(date);
  const today = new Date();

  const sameDay =
    messageDate.toDateString() ===
    today.toDateString();

  if (sameDay) {
    return messageDate.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return messageDate.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function ConversationList({
  conversations,
  selectedId,
  onSelect,
  onNewMessage,
}: ConversationListProps) {
  const [filter, setFilter] =
    useState<MessageFilter>("all");

  const [query, setQuery] = useState("");

  const unreadTotal = conversations.reduce(
    (total, conversation) =>
      total + conversation.unreadCount,
    0
  );

  const filteredConversations = useMemo(() => {
    const normalizedQuery =
      query.trim().toLowerCase();

    return conversations.filter(
      (conversation) => {
        if (
          filter === "unread" &&
          conversation.unreadCount === 0
        ) {
          return false;
        }

        if (
          filter === "archived" &&
          !conversation.archived
        ) {
          return false;
        }

        if (
          filter !== "archived" &&
          conversation.archived
        ) {
          return false;
        }

        if (normalizedQuery) {
          const searchable = [
            conversation.participantName,
            conversation.participantRole,
            conversation.subject,
            conversation.lastMessage,
          ]
            .join(" ")
            .toLowerCase();

          if (
            !searchable.includes(
              normalizedQuery
            )
          ) {
            return false;
          }
        }

        return true;
      }
    );
  }, [conversations, filter, query]);

  return (
    <aside className="conversation-panel">
      <div className="conversation-panel-header">
        <div>
          <span className="message-section-label">
            Secure messaging
          </span>

          <h2>Messages</h2>
        </div>

        {unreadTotal > 0 && (
          <span className="message-total-badge">
            {unreadTotal}
          </span>
        )}
      </div>

      <button
        type="button"
        className="message-new-button"
        onClick={onNewMessage}
      >
        <MessageSquarePlus size={18} />
        New message
      </button>

      <div className="conversation-search">
        <Search size={18} />

        <input
          type="search"
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          placeholder="Search conversations"
          aria-label="Search conversations"
        />
      </div>

      <div className="message-filter-tabs">
        <button
          type="button"
          className={
            filter === "all" ? "active" : ""
          }
          onClick={() => setFilter("all")}
        >
          <Inbox size={16} />
          All
        </button>

        <button
          type="button"
          className={
            filter === "unread" ? "active" : ""
          }
          onClick={() =>
            setFilter("unread")
          }
        >
          Unread

          {unreadTotal > 0 && (
            <span>{unreadTotal}</span>
          )}
        </button>

        <button
          type="button"
          className={
            filter === "sent" ? "active" : ""
          }
          onClick={() => setFilter("sent")}
        >
          <Send size={15} />
          Sent
        </button>

        <button
          type="button"
          className={
            filter === "archived"
              ? "active"
              : ""
          }
          onClick={() =>
            setFilter("archived")
          }
        >
          <Archive size={15} />
          Archived
        </button>
      </div>

      <div className="conversation-list">
        {filteredConversations.length ? (
          filteredConversations.map(
            (conversation) => (
              <button
                key={conversation._id}
                type="button"
                className={`conversation-item ${
                  selectedId ===
                  conversation._id
                    ? "conversation-item-active"
                    : ""
                }`}
                onClick={() =>
                  onSelect(conversation)
                }
              >
                <div className="conversation-avatar">
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

                  {conversation.unreadCount >
                    0 && (
                    <i
                      className="conversation-online-dot"
                      aria-hidden="true"
                    />
                  )}
                </div>

                <div className="conversation-preview">
                  <div className="conversation-preview-top">
                    <strong>
                      {
                        conversation.participantName
                      }
                    </strong>

                    <time>
                      {formatConversationTime(
                        conversation.lastMessageAt
                      )}
                    </time>
                  </div>

                  <span className="conversation-role">
                    {
                      conversation.participantRole
                    }
                  </span>

                  <div className="conversation-preview-bottom">
                    <p>
                      {conversation.lastMessage ||
                        conversation.subject}
                    </p>

                    {conversation.unreadCount >
                      0 && (
                      <b className="conversation-unread-badge">
                        {
                          conversation.unreadCount
                        }
                      </b>
                    )}
                  </div>
                </div>
              </button>
            )
          )
        ) : (
          <div className="conversation-empty">
            <MessageSquarePlus size={28} />

            <strong>
              No conversations here
            </strong>

            <p>
              Your secure conversations will
              appear here.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

export default ConversationList;