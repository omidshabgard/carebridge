import {
  ArrowLeft,
  Send,
  Stethoscope,
  X,
} from "lucide-react";
import {
  FormEvent,
  useState,
} from "react";

import type {
  ConversationCategory,
  CreateConversationInput,
} from "../../services/messageService";

type NewMessageFormProps = {
  onClose: () => void;
  onCreate: (
    input: CreateConversationInput
  ) => Promise<void>;
};

const RECIPIENTS = [
  {
    name: "Dr. Maya Chen",
    role: "Primary Care Physician",
  },
  {
    name: "Care Team",
    role: "Care Coordination",
  },
  {
    name: "Pharmacy Team",
    role: "Medication Support",
  },
  {
    name: "Billing Support",
    role: "Billing Department",
  },
];

const CATEGORIES: {
  value: ConversationCategory;
  label: string;
}[] = [
  {
    value: "general",
    label: "General question",
  },
  {
    value: "appointment",
    label: "Appointment",
  },
  {
    value: "medication",
    label: "Medication",
  },
  {
    value: "care",
    label: "Care question",
  },
  {
    value: "billing",
    label: "Billing",
  },
];

function NewMessageForm({
  onClose,
  onCreate,
}: NewMessageFormProps) {
  const [recipient, setRecipient] =
    useState("");

  const [category, setCategory] =
    useState<ConversationCategory>(
      "general"
    );

  const [subject, setSubject] =
    useState("");

  const [body, setBody] =
    useState("");

  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const selectedRecipient =
      RECIPIENTS.find(
        (item) =>
          item.name === recipient
      );

    if (!selectedRecipient) {
      setError(
        "Please choose a recipient."
      );
      return;
    }

    if (!subject.trim()) {
      setError(
        "Please enter a subject."
      );
      return;
    }

    if (!body.trim()) {
      setError(
        "Please write your message."
      );
      return;
    }

    try {
      setSending(true);
      setError("");

      await onCreate({
        participantName:
          selectedRecipient.name,
        participantRole:
          selectedRecipient.role,
        category,
        subject: subject.trim(),
        body: body.trim(),
      });
    } catch {
      setError(
        "Unable to send your message. Please try again."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="new-message-screen">
      <div className="new-message-card">
        <header className="new-message-header">
          <div>
            <button
              type="button"
              className="new-message-back"
              onClick={onClose}
              aria-label="Go back"
            >
              <ArrowLeft size={19} />
            </button>

            <div>
              <span>
                Secure messaging
              </span>

              <h2>New message</h2>
            </div>
          </div>

          <button
            type="button"
            className="new-message-close"
            onClick={onClose}
            aria-label="Close new message"
          >
            <X size={20} />
          </button>
        </header>

        <div className="new-message-security">
          <Stethoscope size={20} />

          <div>
            <strong>
              Contact your care team
            </strong>

            <p>
              Choose who you want to
              contact and tell them how
              they can help.
            </p>
          </div>
        </div>

        <form
          className="new-message-form"
          onSubmit={handleSubmit}
        >
          <label>
            <span>To</span>

            <select
              value={recipient}
              onChange={(event) =>
                setRecipient(
                  event.target.value
                )
              }
              disabled={sending}
            >
              <option value="">
                Select recipient
              </option>

              {RECIPIENTS.map(
                (item) => (
                  <option
                    key={item.name}
                    value={item.name}
                  >
                    {item.name} —{" "}
                    {item.role}
                  </option>
                )
              )}
            </select>
          </label>

          <label>
            <span>Message about</span>

            <select
              value={category}
              onChange={(event) =>
                setCategory(
                  event.target
                    .value as ConversationCategory
                )
              }
              disabled={sending}
            >
              {CATEGORIES.map(
                (item) => (
                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                )
              )}
            </select>
          </label>

          <label>
            <span>Subject</span>

            <input
              type="text"
              value={subject}
              onChange={(event) =>
                setSubject(
                  event.target.value
                )
              }
              placeholder="What is your message about?"
              maxLength={120}
              disabled={sending}
            />
          </label>

          <label>
            <span>Message</span>

            <textarea
              value={body}
              onChange={(event) =>
                setBody(
                  event.target.value
                )
              }
              placeholder="Write your message..."
              rows={7}
              maxLength={3000}
              disabled={sending}
            />

            <small>
              {body.length} / 3000
            </small>
          </label>

          {error && (
            <div
              className="new-message-error"
              role="alert"
            >
              {error}
            </div>
          )}

          <div className="new-message-actions">
            <button
              type="button"
              className="new-message-cancel"
              onClick={onClose}
              disabled={sending}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="new-message-send"
              disabled={sending}
            >
              <Send size={18} />

              {sending
                ? "Sending..."
                : "Send message"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default NewMessageForm;