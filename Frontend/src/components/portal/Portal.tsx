import { useCallback, useEffect, useMemo, useState } from "react";

import "../../styles/health-records.css";
import "../../styles/portalSignout.css";
import "../../styles/messages.css";
import "../../styles/test-results.css";

import {
  Bell,
  Check,
  ChevronRight,
  FileText,
  LogOut,
  Menu,
  MessageCircle,
  Search,
} from "lucide-react";

import {
  getAppointments,
  type Appointment,
} from "../../services/appointmentService";

import {
  getMedications,
  type Medication,
} from "../../services/medicationService";

import { getConversations } from "../../services/messageService";

import type { Section } from "../../types";
import { content } from "../../data/portalData";

import AppointmentDetails from "../appointments/AppointmentDetails";
import AppointmentForm from "../appointments/AppointmentForm";
import Medications from "../medications/Medications";
import Messages from "../messages/Messages";
import TestResults from "../test-results/TestResults";
import HealthRecords from "../health-records/HealthRecords";

import PortalOverview from "./PortalOverview";
import PortalSidebar from "./PortalSidebar";

type PortalProps = {
  goHome: () => void;
};

export default function Portal({ goHome }: PortalProps) {
  const [active, setActive] = useState<Section>(() => {
    const requestedSection = localStorage.getItem("carebridge_portal_section");

    const savedSection = localStorage.getItem(
      "carebridge_active_section",
    ) as Section | null;

    localStorage.removeItem("carebridge_portal_section");

    if (requestedSection === "Appointments") {
      return "Appointments";
    }

    return savedSection ?? "Overview";
  });

  const [mobile, setMobile] = useState(false);

  const [toast, setToast] = useState("");

  const [query, setQuery] = useState("");

  const [testResultsEntry, setTestResultsEntry] = useState<
    "overview" | "sidebar"
  >("sidebar");

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [medications, setMedications] = useState<Medication[]>([]);

  const [unreadMessages, setUnreadMessages] = useState(0);

  const [showAppointmentForm, setShowAppointmentForm] = useState(false);

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  useEffect(() => {
    localStorage.setItem("carebridge_active_section", active);
  }, [active]);

  useEffect(() => {
    async function loadAppointments() {
      try {
        const data = await getAppointments();

        setAppointments(data);
      } catch (error) {
        console.error("Unable to load appointments:", error);
      }
    }

    loadAppointments();
  }, []);

  useEffect(() => {
    async function loadMedications() {
      try {
        const data = await getMedications();

        setMedications(data);
      } catch (error) {
        console.error("Unable to load medications:", error);
      }
    }

    loadMedications();
  }, []);

  const loadUnreadMessages = useCallback(async () => {
    try {
      const conversations = await getConversations();

      const totalUnread = conversations.reduce(
        (total, conversation) => total + (conversation.unreadCount ?? 0),
        0,
      );

      setUnreadMessages(totalUnread);
    } catch (error) {
      console.error("Unable to load unread messages:", error);
    }
  }, []);

  useEffect(() => {
    void loadUnreadMessages();
  }, [loadUnreadMessages]);

  useEffect(() => {
    if (active !== "Messages") {
      return;
    }

    void loadUnreadMessages();
  }, [active, loadUnreadMessages]);

  const show = (message: string) => {
    setToast(message);

    window.setTimeout(() => {
      setToast("");
    }, 3500);
  };

  const changeSection = (section: Section) => {
    setActive(section);
    setSelectedAppointment(null);
    setShowAppointmentForm(false);
    setMobile(false);
    setQuery("");

    if (section === "Messages") {
      window.setTimeout(() => {
        void loadUnreadMessages();
      }, 300);
    }
  };

  const handleMessageActivity = () => {
    void loadUnreadMessages();
  };

  const signOut = () => {
    localStorage.removeItem("carebridge_token");

    localStorage.removeItem("carebridge_user");

    window.location.assign("/");
  };

  const items = useMemo(() => {
    if (
      active === "Overview" ||
      active === "Messages" ||
      active === "Test results" ||
      active === "Health records"
    ) {
      return [];
    }

    if (active === "Appointments") {
      return appointments
        .map((appointment) => {
          const date = new Date(appointment.startsAt);

          return {
            appointmentId: appointment._id,

            title: appointment.reason,

            detail: `${appointment.providerName} • ${appointment.specialty}`,

            meta: date.toLocaleString("en-US", {
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            }),

            status:
              appointment.status.charAt(0).toUpperCase() +
              appointment.status.slice(1),
          };
        })
        .filter((item) =>
          (item.title + item.detail)
            .toLowerCase()
            .includes(query.toLowerCase()),
        );
    }

    return content[active].items.filter((item) =>
      (item.title + item.detail).toLowerCase().includes(query.toLowerCase()),
    );
  }, [active, query, appointments]);

  return (
    <div className="app">
      <PortalSidebar
        active={active}
        mobile={mobile}
        goHome={goHome}
        onClose={() => setMobile(false)}
        onSectionChange={(section) => {
          if (section === "Test results") {
            setTestResultsEntry("sidebar");
          }

          changeSection(section);
        }}
        unreadMessages={unreadMessages}
      />

      <main>
        <header>
          <button className="hamburger" onClick={() => setMobile(true)}>
            <Menu />
          </button>

          <label>
            <Search />

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={
                active === "Messages"
                  ? "Search messages..."
                  : active === "Test results"
                    ? "Search test results..."
                    : active === "Health records"
                      ? "Use Health Records search below..."
                      : "Search this section..."
              }
              disabled={
                active === "Messages" ||
                active === "Test results" ||
                active === "Health records"
              }
            />
          </label>

          <button className="bell">
            <Bell />

            {unreadMessages > 0 && <i />}
          </button>

          <button
            className="help"
            onClick={() => {
              changeSection("Messages");

              show("Support conversation opened.");
            }}
          >
            <MessageCircle />
            Help center
          </button>

          <button className="portal-signout-button" onClick={signOut}>
            <LogOut />
            Sign out
          </button>
        </header>

        <section className="page">
          {toast && (
            <div className="toast">
              <Check />
              {toast}
            </div>
          )}

          {active === "Overview" ? (
            <PortalOverview
              appointments={appointments}
              medications={medications}
              onSectionChange={changeSection}
              onOpenTestResults={() => {
                setTestResultsEntry("overview");
                changeSection("Test results");
              }}
              show={show}
            />
          ) : active === "Messages" ? (
            <Messages show={show} onMessageActivity={handleMessageActivity} />
          ) : active === "Test results" ? (
            <TestResults
              show={show}
              showBackToOverview={testResultsEntry === "overview"}
              onBackToOverview={() => {
                setTestResultsEntry("sidebar");
                changeSection("Overview");
              }}
            />
          ) : active === "Health records" ? (
            <HealthRecords show={show} />
          ) : (
            <section className="section">
              <div className="section-head">
                <div>
                  <small>PATIENT PORTAL</small>

                  <h1>{active}</h1>

                  <p>{content[active].intro}</p>
                </div>

                <button
                  onClick={() => {
                    setSelectedAppointment(null);

                    setShowAppointmentForm(false);

                    setActive("Overview");
                  }}
                >
                  Back to overview
                </button>
              </div>

              {active === "Medications" ? (
                <Medications show={show} />
              ) : active === "Appointments" && selectedAppointment ? (
                <AppointmentDetails
                  appointment={selectedAppointment}
                  onBack={() => setSelectedAppointment(null)}
                  onCancelled={(updatedAppointment) => {
                    setAppointments((current) =>
                      current.map((appointment) =>
                        appointment._id === updatedAppointment._id
                          ? updatedAppointment
                          : appointment,
                      ),
                    );

                    setSelectedAppointment(updatedAppointment);

                    show("Appointment cancelled successfully.");
                  }}
                  onDeleted={(appointmentId) => {
                    setAppointments((current) =>
                      current.filter(
                        (appointment) => appointment._id !== appointmentId,
                      ),
                    );

                    setSelectedAppointment(null);

                    show("Appointment deleted permanently.");
                  }}
                />
              ) : (
                <>
                  {active === "Appointments" && showAppointmentForm && (
                    <AppointmentForm
                      onCreated={(appointment) => {
                        setAppointments((current) => [appointment, ...current]);

                        setShowAppointmentForm(false);

                        show("Appointment booked successfully.");
                      }}
                      onCancel={() => setShowAppointmentForm(false)}
                    />
                  )}

                  <div className="item-list">
                    {items.length ? (
                      items.map((item) => (
                        <article key={item.title}>
                          <span>
                            <FileText />
                          </span>

                          <div>
                            <h2>{item.title}</h2>

                            <p>{item.detail}</p>

                            <small>{item.meta}</small>
                          </div>

                          {item.status && <i>{item.status}</i>}

                          <button
                            onClick={() => {
                              if (
                                active === "Appointments" &&
                                "appointmentId" in item
                              ) {
                                const appointment = appointments.find(
                                  (current) =>
                                    current._id === item.appointmentId,
                                );

                                if (appointment) {
                                  setSelectedAppointment(appointment);

                                  setShowAppointmentForm(false);
                                }

                                return;
                              }

                              show(`${item.title} opened.`);
                            }}
                          >
                            <ChevronRight />
                          </button>
                        </article>
                      ))
                    ) : (
                      <div className="empty">
                        {active === "Appointments" && !query
                          ? "No appointments yet."
                          : `No results match “${query}”.`}
                      </div>
                    )}
                  </div>

                  <button
                    className="action"
                    onClick={() => {
                      if (active === "Appointments") {
                        setSelectedAppointment(null);

                        setShowAppointmentForm(true);

                        return;
                      }

                      show(`${active} request started.`);
                    }}
                  >
                    Start new request
                  </button>
                </>
              )}
            </section>
          )}
        </section>
      </main>
    </div>
  );
}
