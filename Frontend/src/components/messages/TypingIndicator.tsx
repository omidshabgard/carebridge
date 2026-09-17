type TypingIndicatorProps = {
  name?: string;
  visible: boolean;
};

function TypingIndicator({
  name = "Care team",
  visible,
}: TypingIndicatorProps) {
  if (!visible) {
    return null;
  }

  return (
    <div className="message-typing-row">
      <div className="message-typing-avatar">
        {name
          .split(" ")
          .map((part) => part[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()}
      </div>

      <div>
        <div className="message-typing-bubble">
          <span />
          <span />
          <span />
        </div>

        <small className="message-typing-label">
          {name} is typing...
        </small>
      </div>
    </div>
  );
}

export default TypingIndicator;