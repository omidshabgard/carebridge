import {
  CheckCheck,
  Copy,
  FileText,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type {
  Message,
} from "../../services/messageService";

type MessageBubbleProps = {
  message: Message;
  onDelete?: (message: Message) => Promise<void>;
};

function formatMessageTime(date: string) {
  return new Date(date).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function MessageBubble({
  message,
  onDelete,
}: MessageBubbleProps) {
  const sentByPatient =
    message.senderType === "patient";

  const systemMessage =
    message.senderType === "system";

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const menuRef =
    useRef<HTMLDivElement | null>(null);

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

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(
        message.body
      );

      setMenuOpen(false);
    } catch {
      window.alert(
        "Unable to copy this message."
      );
    }
  }

  async function handleDelete() {
    if (!onDelete || deleting) {
      return;
    }

    const confirmed = window.confirm(
      "Delete this message permanently? This cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      await onDelete(message);

      setMenuOpen(false);
    } catch {
      window.alert(
        "Unable to delete this message."
      );
    } finally {
      setDeleting(false);
    }
  }

  if (systemMessage) {
    return (
      <div className="message-system-row">
        <span>{message.body}</span>
      </div>
    );
  }

  return (
    <div
      className={`message-bubble-row ${
        sentByPatient
          ? "message-bubble-row-sent"
          : "message-bubble-row-received"
      }`}
    >
      {!sentByPatient && (
        <div className="message-bubble-avatar">
          {message.senderName
            .split(" ")
            .map((part) => part[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()}
        </div>
      )}

      <div className="message-bubble-content">
        {!sentByPatient && (
          <span className="message-bubble-sender">
            {message.senderName}
          </span>
        )}

        <div className="message-bubble-wrapper">
          <div
            className={`message-bubble ${
              sentByPatient
                ? "message-bubble-sent"
                : "message-bubble-received"
            }`}
          >
            <p>{message.body}</p>

            {message.attachment?.name && (
              <a
                className="message-attachment"
                href={message.attachment.url}
                target="_blank"
                rel="noreferrer"
              >
                <FileText size={18} />

                <span>
                  {message.attachment.name}
                </span>
              </a>
            )}

            <div className="message-bubble-meta">
              <time>
                {formatMessageTime(
                  message.createdAt
                )}
              </time>

              {sentByPatient && (
                <CheckCheck size={15} />
              )}
            </div>
          </div>

          {sentByPatient && (
            <div
              className="message-bubble-menu"
              ref={menuRef}
            >
              <button
                type="button"
                className="message-bubble-menu-button"
                onClick={() =>
                  setMenuOpen(
                    (current) => !current
                  )
                }
                aria-label="Message options"
              >
                <MoreHorizontal size={18} />
              </button>

              {menuOpen && (
                <div className="message-bubble-dropdown">
                  <button
                    type="button"
                    onClick={() =>
                      void handleCopy()
                    }
                  >
                    <Copy size={16} />
                    Copy
                  </button>

                  <button
                    type="button"
                    className="message-delete-option"
                    onClick={() =>
                      void handleDelete()
                    }
                    disabled={deleting}
                  >
                    <Trash2 size={16} />

                    {deleting
                      ? "Deleting..."
                      : "Delete message"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;