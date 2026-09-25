import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Mail,
  MessageCircle,
  Phone,
  Search,
  Stethoscope,
  X,
} from "lucide-react";

type CareMember = {
  id: number;
  name: string;
  specialty: string;
  role: string;
  location: string;
  phone: string;
  nextVisit?: string;
  primary?: boolean;
};

const careTeam: CareMember[] = [
  {
    id: 1,
    name: "Dr. Maya Chen",
    specialty: "Primary Care",
    role: "Primary care physician",
    location: "CareBridge Primary Care",
    phone: "(518) 555-0124",
    nextVisit: "Oct 8, 2026 • 10:30 AM",
    primary: true,
  },
  {
    id: 2,
    name: "Dr. James Park",
    specialty: "Cardiology",
    role: "Cardiologist",
    location: "CareBridge Heart Center",
    phone: "(518) 555-0188",
    nextVisit: "Oct 21, 2026 • 2:00 PM",
  },
  {
    id: 3,
    name: "Sarah Williams, RN",
    specialty: "Care Coordination",
    role: "Care coordinator",
    location: "CareBridge Patient Services",
    phone: "(518) 555-0162",
  },
];

export default function CareTeam() {
  const [query, setQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<CareMember | null>(null);
  const [messageMember, setMessageMember] = useState<CareMember | null>(null);
  const [message, setMessage] = useState("");
  const [messageSent, setMessageSent] = useState(false);

  const visibleTeam = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return careTeam;
    }

    return careTeam.filter((member) =>
      `${member.name} ${member.specialty} ${member.role}`
        .toLowerCase()
        .includes(search),
    );
  }, [query]);

  const sendMessage = () => {
    if (!message.trim()) {
      return;
    }

    setMessageSent(true);
  };

  const closeMessage = () => {
    setMessageMember(null);
    setMessage("");
    setMessageSent(false);
  };

  return (
    <div className="care-team-page">
      <section className="care-team-hero">
        <div>
          <small>YOUR CARE TEAM</small>
          <h2>People supporting your care</h2>
          <p>
            Find your doctors, specialists, and care coordinators in one place.
          </p>
        </div>

        <div className="care-team-count">
          <Stethoscope />
          <div>
            <strong>{careTeam.length}</strong>
            <span>Care team members</span>
          </div>
        </div>
      </section>

      <div className="care-team-search">
        <Search />

        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search your care team..."
        />
      </div>

      <section className="care-team-grid">
        {visibleTeam.map((member) => (
          <article className="care-member-card" key={member.id}>
            <div className="care-member-top">
              <div className="care-member-avatar">
                {member.name
                  .replace("Dr. ", "")
                  .split(" ")
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")}
              </div>

              <div>
                <h3>{member.name}</h3>
                <p>{member.specialty}</p>
              </div>

              {member.primary && (
                <span className="care-primary-badge">
                  <CheckCircle2 />
                  Primary
                </span>
              )}
            </div>

            <div className="care-member-info">
              <span>
                <Stethoscope />
                {member.role}
              </span>

              <span>
                <Phone />
                {member.phone}
              </span>

              {member.nextVisit && (
                <span>
                  <CalendarDays />
                  {member.nextVisit}
                </span>
              )}
            </div>

            <div className="care-member-actions">
              <button onClick={() => setSelectedMember(member)}>
                View profile
              </button>

              <button
                className="care-message-button"
                onClick={() => setMessageMember(member)}
              >
                <MessageCircle />
                Message
              </button>
            </div>
          </article>
        ))}
      </section>

      {!visibleTeam.length && (
        <div className="care-team-empty">
          No care team members match “{query}”.
        </div>
      )}

      {selectedMember && (
        <div
          className="care-modal-backdrop"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="care-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="care-modal-close"
              onClick={() => setSelectedMember(null)}
            >
              <X />
            </button>

            <small>CARE TEAM PROFILE</small>

            <div className="care-profile-heading">
              <div className="care-profile-avatar">
                {selectedMember.name
                  .replace("Dr. ", "")
                  .split(" ")
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")}
              </div>

              <div>
                <h2>{selectedMember.name}</h2>
                <p>{selectedMember.specialty}</p>
              </div>
            </div>

            <div className="care-profile-details">
              <span>
                Role
                <strong>{selectedMember.role}</strong>
              </span>

              <span>
                Location
                <strong>{selectedMember.location}</strong>
              </span>

              <span>
                Phone
                <strong>{selectedMember.phone}</strong>
              </span>

              <span>
                Next visit
                <strong>
                  {selectedMember.nextVisit ?? "No upcoming visit"}
                </strong>
              </span>
            </div>

            <button
              className="care-primary-button"
              onClick={() => {
                setSelectedMember(null);
                setMessageMember(selectedMember);
              }}
            >
              <Mail />
              Send message
            </button>
          </div>
        </div>
      )}

      {messageMember && (
        <div className="care-modal-backdrop" onClick={closeMessage}>
          <div
            className="care-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button className="care-modal-close" onClick={closeMessage}>
              <X />
            </button>

            {!messageSent ? (
              <>
                <small>NEW MESSAGE</small>
                <h2>Message {messageMember.name}</h2>

                <label className="care-message-field">
                  Message
                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Type your message..."
                    rows={5}
                  />
                </label>

                <button
                  className="care-primary-button"
                  disabled={!message.trim()}
                  onClick={sendMessage}
                >
                  <MessageCircle />
                  Send message
                </button>
              </>
            ) : (
              <div className="care-message-success">
                <CheckCircle2 />
                <h2>Message sent</h2>
                <p>
                  Your demo message to {messageMember.name} has been recorded.
                </p>

                <button className="care-primary-button" onClick={closeMessage}>
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}