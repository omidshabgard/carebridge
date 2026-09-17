import {
  Paperclip,
  Send,
  Smile,
} from "lucide-react";
import {
  FormEvent,
  KeyboardEvent,
  useState,
} from "react";

type MessageComposerProps = {
  onSend: (message: string) => Promise<void>;
  disabled?: boolean;
};

const QUICK_EMOJIS = [
  "😊",
  "👍",
  "❤️",
  "🙏",
  "😂",
  "🎉",
];

function MessageComposer({
  onSend,
  disabled = false,
}: MessageComposerProps) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showEmojis, setShowEmojis] =
    useState(false);

  async function handleSubmit(
    event?: FormEvent<HTMLFormElement>
  ) {
    event?.preventDefault();

    const trimmedMessage = message.trim();

    if (
      !trimmedMessage ||
      sending ||
      disabled
    ) {
      return;
    }

    try {
      setSending(true);

      await onSend(trimmedMessage);

      setMessage("");
      setShowEmojis(false);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      void handleSubmit();
    }
  }

  function addEmoji(emoji: string) {
    setMessage((current) => current + emoji);
  }

  return (
    <div className="message-composer-area">
      {showEmojis && (
        <div className="message-emoji-picker">
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => addEmoji(emoji)}
              aria-label={`Add ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <form
        className="message-composer"
        onSubmit={handleSubmit}
      >
        <button
          type="button"
          className="message-composer-tool"
          aria-label="Add attachment"
          title="Attachments coming soon"
        >
          <Paperclip size={20} />
        </button>

        <button
          type="button"
          className="message-composer-tool"
          aria-label="Add emoji"
          onClick={() =>
            setShowEmojis((current) => !current)
          }
        >
          <Smile size={20} />
        </button>

        <textarea
          value={message}
          onChange={(event) =>
            setMessage(event.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows={1}
          disabled={disabled || sending}
          aria-label="Message"
        />

        <button
          type="submit"
          className="message-send-button"
          disabled={
            disabled ||
            sending ||
            !message.trim()
          }
        >
          <Send size={18} />

          {sending ? "Sending..." : "Send"}
        </button>
      </form>

      <small className="message-composer-hint">
        Press Enter to send • Shift + Enter for a new line
      </small>
    </div>
  );
}

export default MessageComposer;