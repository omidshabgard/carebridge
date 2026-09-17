import {
  CalendarDays,
  FileText,
  HeartPulse,
  Phone,
  Stethoscope,
  UserRound,
  Video,
} from "lucide-react";

import type {
  Conversation,
} from "../../services/messageService";

type ContactPanelProps = {
  conversation: Conversation;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function ContactPanel({
  conversation,
}: ContactPanelProps) {
  return (
    <aside className="message-contact-panel">
      <div className="message-contact-profile">
        <div className="message-contact-avatar">
          {conversation.participantAvatar ? (
            <img
              src={conversation.participantAvatar}
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

        <h3>
          {conversation.participantName}
        </h3>

        <p>
          {conversation.participantRole}
        </p>

        <div className="message-contact-status">
          <span />
          Care team
        </div>
      </div>

      <div className="message-contact-actions">
        <button
          type="button"
          title="Calling coming soon"
        >
          <Phone size={18} />

          <span>Call</span>
        </button>

        <button
          type="button"
          title="Video visits coming soon"
        >
          <Video size={18} />

          <span>Video</span>
        </button>

        <button
          type="button"
          title="Provider profile coming soon"
        >
          <UserRound size={18} />

          <span>Profile</span>
        </button>
      </div>

      <div className="message-contact-section">
        <div className="message-contact-section-title">
          <FileText size={18} />

          <h4>Shared files</h4>
        </div>

        <div className="message-shared-file">
          <div>
            <FileText size={18} />
          </div>

          <span>
            <strong>
              Lab results
            </strong>

            <small>
              Health document
            </small>
          </span>
        </div>

        <div className="message-shared-file">
          <div>
            <HeartPulse size={18} />
          </div>

          <span>
            <strong>
              Care instructions
            </strong>

            <small>
              Care plan
            </small>
          </span>
        </div>
      </div>

      <div className="message-contact-section">
        <div className="message-contact-section-title">
          <CalendarDays size={18} />

          <h4>Upcoming appointment</h4>
        </div>

        <div className="message-appointment-card">
          <div className="message-appointment-icon">
            <Stethoscope size={20} />
          </div>

          <div>
            <strong>
              Follow-up visit
            </strong>

            <span>
              {conversation.participantName}
            </span>

            <small>
              Appointment details will appear
              here when connected.
            </small>
          </div>
        </div>
      </div>

      <div className="message-contact-section">
        <h4>Quick actions</h4>

        <button
          type="button"
          className="message-contact-link"
        >
          <CalendarDays size={17} />
          Schedule appointment
        </button>

        <button
          type="button"
          className="message-contact-link"
        >
          <FileText size={17} />
          View health records
        </button>

        <button
          type="button"
          className="message-contact-link"
        >
          <HeartPulse size={17} />
          View care plan
        </button>
      </div>
    </aside>
  );
}

export default ContactPanel;