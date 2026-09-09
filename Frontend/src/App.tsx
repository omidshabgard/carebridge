import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Clock,
  FileHeart,
  FileText,
  HeartPulse,
  Home,
  Hospital,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Pill,
  Search,
  Settings,
  ShieldCheck,
  Stethoscope,
  UserRound,
  X,
} from "lucide-react";
import {
  getAppointments,
  type Appointment,
} from "./services/appointmentService";


import type { PortalItem, Section } from "./types";
import AboutSection from "./AboutSection";
import FindCareSection from "./FindCareSection";
import AppointmentForm from "./components/appointments/AppointmentForm";
import AppointmentDetails from "./components/appointments/AppointmentDetails";

const nav: {
  name: Section;
  icon: typeof Home;
  badge?: number;
  color: string;
}[] = [
  {
    name: "Overview",
    icon: Home,
    color: "mint",
  },
  {
    name: "Appointments",
    icon: CalendarDays,
    color: "blue",
  },
  {
    name: "Messages",
    icon: MessageCircle,
    badge: 2,
    color: "coral",
  },
  {
    name: "Medications",
    icon: Pill,
    color: "violet",
  },
  {
    name: "Test results",
    icon: ClipboardList,
    badge: 1,
    color: "amber",
  },
  {
    name: "Health records",
    icon: FileHeart,
    color: "rose",
  },
  {
    name: "Billing",
    icon: CircleDollarSign,
    color: "green",
  },
  {
    name: "Insurance",
    icon: ShieldCheck,
    color: "cyan",
  },
  {
    name: "Care team",
    icon: Stethoscope,
    color: "indigo",
  },
  {
    name: "Documents",
    icon: FileText,
    color: "orange",
  },
  {
    name: "Settings",
    icon: Settings,
    color: "slate",
  },
];

const content: Record<
  Exclude<Section, "Overview">,
  {
    intro: string;
    items: PortalItem[];
  }
> = {
  Appointments: {
    intro: "Schedule, reschedule, and prepare for care.",
    items: [
      {
        title: "Annual wellness visit",
        detail: "Dr. Maya Chen • Primary Care",
        meta: "September 12 • 10:30 AM",
        status: "Confirmed",
      },
      {
        title: "Cardiology follow-up",
        detail: "Dr. James Park • Video visit",
        meta: "September 18 • 2:00 PM",
        status: "Confirmed",
      },
    ],
  },

  Messages: {
    intro: "Secure conversations with your care team.",
    items: [
      {
        title: "Dr. Maya Chen",
        detail:
          "Your lab results look good. Let’s review them at your visit.",
        meta: "Today • 9:15 AM",
        status: "Unread",
      },
      {
        title: "Care coordination",
        detail: "Your cardiology referral has been approved.",
        meta: "Yesterday",
      },
    ],
  },

  Medications: {
    intro: "Track doses, instructions, and refills.",
    items: [
      {
        title: "Lisinopril • 10 mg",
        detail: "Take once daily in the morning",
        meta: "5 days remaining",
        status: "Refill soon",
      },
      {
        title: "Vitamin D3 • 1,000 IU",
        detail: "Take once daily with food",
        meta: "Next dose • 6:00 PM",
      },
    ],
  },

  "Test results": {
    intro: "Review results with plain-language status labels.",
    items: [
      {
        title: "Complete blood count",
        detail: "All values within expected range",
        meta: "August 28",
        status: "New",
      },
      {
        title: "Lipid panel",
        detail: "One value needs discussion at your next visit",
        meta: "August 28",
        status: "Follow up",
      },
    ],
  },

  "Health records": {
    intro: "Your medical history in one organized view.",
    items: [
      {
        title: "Annual visit summary",
        detail: "Primary care • Dr. Maya Chen",
        meta: "March 14 • PDF available",
      },
      {
        title: "Immunization record",
        detail: "8 verified immunizations",
        meta: "Updated July 6",
      },
    ],
  },

  Billing: {
    intro: "Understand balances, statements, and payments.",
    items: [
      {
        title: "Current balance",
        detail: "Primary care visit",
        meta: "Due September 30",
        status: "$42.00",
      },
      {
        title: "August statement",
        detail: "Insurance processed",
        meta: "Statement #CB-21984",
      },
    ],
  },

  Insurance: {
    intro: "Coverage details and recent claims.",
    items: [
      {
        title: "NorthStar Health PPO",
        detail: "Member ID • NSH-48021",
        meta: "Coverage active",
        status: "Active",
      },
      {
        title: "Cardiology claim",
        detail: "Amount billed • $260.00",
        meta: "Processed August 30",
      },
    ],
  },

  "Care team": {
    intro: "Your doctors, specialists, and care coordinators.",
    items: [
      {
        title: "Dr. Maya Chen",
        detail: "Primary care physician",
        meta: "Next visit • September 12",
      },
      {
        title: "Dr. James Park",
        detail: "Cardiologist",
        meta: "Next visit • September 18",
      },
    ],
  },

  Documents: {
    intro: "Forms, letters, and downloadable records.",
    items: [
      {
        title: "Pre-visit questionnaire",
        detail: "Complete before your annual visit",
        meta: "Due September 11",
        status: "Action needed",
      },
      {
        title: "Work clearance letter",
        detail: "Signed by Dr. Maya Chen",
        meta: "PDF • August 11",
      },
    ],
  },

  Settings: {
    intro: "Manage contact details, notifications, and access.",
    items: [
      {
        title: "Profile and contact",
        detail: "Email, phone, address, emergency contact",
        meta: "Last reviewed August 2",
      },
      {
        title: "Security and privacy",
        detail: "Password, sign-in activity, data access",
        meta: "Two-step verification available",
      },
    ],
  },
};

function Metric({
  title,
  value,
  unit,
  tone,
  icon: Icon,
}: {
  title: string;
  value: string;
  unit: string;
  tone: string;
  icon: typeof Activity;
}) {
  return (
    <article className="metric">
      <span className={tone}>
        <Icon />
      </span>

      <div>
        <small>{title}</small>

        <strong>
          {value}
          <em>{unit}</em>
        </strong>

        <p>
          <Check />
          Within your range
        </p>
      </div>
    </article>
  );
}

function Brand({
  onClick,
  className = "logo",
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      className={className}
      onClick={onClick}
      aria-label="Go to CareBridge home"
    >
      <HeartPulse />

      <b>
        Care<span>Bridge</span>
      </b>
    </button>
  );
}

function Landing({ goPortal }: { goPortal: () => void }) {
  return (
    <div className="landing">
      <header className="public-header">
        <Brand
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
          className="public-logo"
        />

        <nav>
          <a href="#services">Services</a>
          <a href="#care">Find care</a>
          <a href="#about">About us</a>
          <a href="#resources">Health resources</a>
        </nav>

        <div>
          <a className="call" href="tel:18005552273">
            <Phone />
            1-800-555-CARE
          </a>

          <button
  onClick={() => {
    localStorage.setItem("carebridge_portal_section", "Appointments");
    goPortal();
  }}
>
  <CalendarDays />
  Schedule an appointment
</button>
        </div>
      </header>

      <main className="landing-main">
        <section className="landing-hero">
          <div>
            <span className="eyebrow">
              <HeartPulse />
              COMPASSIONATE CARE, CLOSE TO HOME
            </span>

            <h1>
              Healthcare built around <em>your life.</em>
            </h1>

            <p>
              From everyday wellness to specialized treatment, CareBridge
              connects you with trusted care, clear answers, and a healthier
              tomorrow.
            </p>

            <div className="hero-actions">
              <button onClick={goPortal}>
                <CalendarDays />
                Schedule an appointment
              </button>

              <a href="#care">
                <MapPin />
                Find a location
              </a>
            </div>

            <div className="trust">
              <span>
                <b>24/7</b> nurse support
              </span>

              <span>
                <b>30+</b> care locations
              </span>

              <span>
                <b>97%</b> patient satisfaction
              </span>
            </div>
          </div>
          <div className="hero-handwritten" aria-hidden="true">
  <span>
    Better care
    <br />
    together ♡
  </span>

  <span className="hero-handwritten-arrow">↘</span>
</div>
          <aside>
            <div>
              <Clock />

              <span>
                <b>Need care today?</b>
                <small>
                  Find same-day and urgent care options near you.
                </small>
              </span>

              <button>
                View wait times
                <ChevronRight />
              </button>
            </div>
          </aside>
        </section>

        <section className="service-strip" id="services">
          <button>
            <Hospital />

            <span>
              <b>Hospitals</b>
              <small>Advanced care and services</small>
            </span>

            <ChevronRight />
          </button>

          <button>
            <Stethoscope />

            <span>
              <b>Primary Care</b>
              <small>Care for every stage of life</small>
            </span>

            <ChevronRight />
          </button>

          <button>
            <Activity />

            <span>
              <b>Urgent Care</b>
              <small>Same-day help when needed</small>
            </span>

            <ChevronRight />
          </button>

          <button>
            <UserRound />

            <span>
              <b>Specialty Care</b>
              <small>Experts focused on you</small>
            </span>

            <ChevronRight />
          </button>
        </section>

       <section className="care-about-layout">
  <FindCareSection />
  <AboutSection />
</section>
    
      </main>

      <footer>
        <Brand
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
          className="footer-logo"
        />

        <p>CareBridge Health • Care that knows you.</p>

        <button onClick={goPortal}>
          Open patient portal
          <ArrowRight />
        </button>
      </footer>
    </div>
  );
}

function Portal({ goHome }: { goHome: () => void }) {
  const [active, setActive] = useState<Section>(() => {
    const requestedSection = localStorage.getItem(
      "carebridge_portal_section"
    );

    const savedSection = localStorage.getItem(
      "carebridge_active_section"
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

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState("");
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  useEffect(() => {
    localStorage.setItem("carebridge_active_section", active);
  }, [active]);

  useEffect(() => {
    async function loadAppointments() {
      try {
        setAppointmentsLoading(true);
        setAppointmentsError("");

        const data = await getAppointments();
        setAppointments(data);
      } catch (error) {
        console.error(error);
        setAppointmentsError("Unable to load appointments.");
      } finally {
        setAppointmentsLoading(false);
      }
    }

    loadAppointments();
  }, []);

  const show = (message: string) => {
    setToast(message);

    window.setTimeout(() => {
      setToast("");
    }, 3500);
  };

  const items = useMemo(() => {
  if (active === "Overview") {
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
          .includes(query.toLowerCase())
      );
  }

  return content[active].items.filter((item) =>
    (item.title + item.detail)
      .toLowerCase()
      .includes(query.toLowerCase())
  );
}, [active, query, appointments]);

  return (
    <div className="app">
      <aside className={mobile ? "sidebar open" : "sidebar"}>
        <button
          className="close"
          onClick={() => setMobile(false)}
        >
          <X />
        </button>

        <Brand onClick={goHome} />

        <div className="patient">
          <span>OS</span>

          <div>
            <b>Omid Shabgard</b>
            <small>Patient ID • 08421</small>
          </div>
        </div>

        <nav>
          {nav.map(({ name, icon: Icon, badge, color }) => (
            <button
              key={name}
              className={active === name ? `active ${color}` : ""}
              onClick={() => {
                setActive(name);
                setSelectedAppointment(null);
                setShowAppointmentForm(false);
                setMobile(false);
                setQuery("");
              }}
            >
              <Icon />
              <span>{name}</span>

              {badge && <i>{badge}</i>}
            </button>
          ))}
        </nav>

        <div className="secure">
          <ShieldCheck />

          <div>
            <b>Your information is protected</b>
            <small>Secure & encrypted</small>
          </div>
        </div>
      </aside>

      <main>
        <header>
          <button
            className="hamburger"
            onClick={() => setMobile(true)}
          >
            <Menu />
          </button>

          <label>
            <Search />

            <input
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Search this section..."
            />
          </label>

          <button className="bell">
            <Bell />
            <i />
          </button>

          <button
            className="help"
            onClick={() => {
              setActive("Messages");
              show("Support conversation opened.");
            }}
          >
            <MessageCircle />
            Help center
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
            <>
              <section className="hero">
                <div>
                  <span>
                    <HeartPulse />
                    YOUR HEALTH, CONNECTED
                  </span>

                  <h1>Care that knows you.</h1>

                  <p>
                    Manage your health and stay connected with your care
                    team—all in one calm, secure place.
                  </p>

                  <button
                    onClick={() =>
                      setActive("Appointments")
                    }
                  >
                    <CalendarDays />
                    Schedule a visit
                  </button>
                </div>
              </section>

              <section className="care-types">
                <button
                  onClick={() => {
                    setActive("Appointments");
                    show("Urgent care locations loaded.");
                  }}
                >
                  <span className="urgent">
                    <Hospital />
                  </span>

                  <b>
                    Urgent Care
                    <small>Same-day help</small>
                  </b>

                  <ChevronRight />
                </button>

                <button
                  onClick={() =>
                    setActive("Appointments")
                  }
                >
                  <span className="primary">
                    <Stethoscope />
                  </span>

                  <b>
                    Primary Care
                    <small>Everyday wellness</small>
                  </b>

                  <ChevronRight />
                </button>

                <button
                  onClick={() =>
                    setActive("Care team")
                  }
                >
                  <span className="specialty">
                    <UserRound />
                  </span>

                  <b>
                    Specialty Care
                    <small>Expert treatment</small>
                  </b>

                  <ChevronRight />
                </button>
              </section>

              <div className="welcome">
                <div>
                  <small>FRIDAY, SEPTEMBER 4</small>
                  <h2>Good morning, Omid.</h2>
                  <p>
                    Here’s what’s happening with your health today.
                  </p>
                </div>

                <button
                  onClick={() =>
                    setActive("Appointments")
                  }
                >
                  <CalendarDays />
                  Book appointment
                </button>
              </div>

              <section className="metrics">
                <Metric
                  title="BLOOD PRESSURE"
                  value="118/76"
                  unit="mmHg"
                  tone="red"
                  icon={HeartPulse}
                />

                <Metric
                  title="HEART RATE"
                  value="72"
                  unit="bpm"
                  tone="teal"
                  icon={Activity}
                />

                <Metric
                  title="WEIGHT"
                  value="174"
                  unit="lbs"
                  tone="blue"
                  icon={UserRound}
                />
              </section>

              <section className="overview-grid">
                <article className="card">
                  <div className="card-head">
                    <div>
                      <small>YOUR SCHEDULE</small>
                      <h3>Upcoming appointments</h3>
                    </div>

                    <button
                      onClick={() =>
                        setActive("Appointments")
                      }
                    >
                      View all
                      <ChevronRight />
                    </button>
                  </div>

                  {content.Appointments.items.map((item) => (
                    <div
                      className="row"
                      key={item.title}
                    >
                      <span className="date">
                        12
                        <small>SEP</small>
                      </span>

                      <div>
                        <b>{item.title}</b>
                        <p>{item.detail}</p>
                        <small>{item.meta}</small>
                      </div>

                      <i>{item.status}</i>
                    </div>
                  ))}
                </article>

                <article className="card">
                  <div className="card-head">
                    <div>
                      <small>TODAY</small>
                      <h3>Medications</h3>
                    </div>

                    <button
                      onClick={() =>
                        setActive("Medications")
                      }
                    >
                      View all
                      <ChevronRight />
                    </button>
                  </div>

                  {content.Medications.items.map(
                    (item, index) => (
                      <div
                        className="row"
                        key={item.title}
                      >
                        <span
                          className={
                            index ? "med amber" : "med"
                          }
                        >
                          <Pill />
                        </span>

                        <div>
                          <b>{item.title}</b>
                          <p>{item.detail}</p>
                          <small>{item.meta}</small>
                        </div>

                        {!index && (
                          <button
                            className="outline"
                            onClick={() =>
                              show(
                                "Lisinopril marked as taken."
                              )
                            }
                          >
                            Mark taken
                          </button>
                        )}
                      </div>
                    )
                  )}
                </article>
              </section>
            </>
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
              {active === "Appointments" && selectedAppointment ? (
                <AppointmentDetails
                  appointment={selectedAppointment}
                  onBack={() => setSelectedAppointment(null)}
                  onCancelled={(updatedAppointment) => {
                    setAppointments((current) =>
                      current.map((appointment) =>
                        appointment._id === updatedAppointment._id
                          ? updatedAppointment
                          : appointment
                      )
                    );

                    setSelectedAppointment(updatedAppointment);
                    show("Appointment cancelled successfully.");
                  }}
                />
              ) : (
                <>
                  {active === "Appointments" && showAppointmentForm && (
                    <AppointmentForm
                      onCreated={(appointment) => {
                        setAppointments((current) => [
                          appointment,
                          ...current,
                        ]);
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
                                const appointment =
                                  appointments.find(
                                    (current) =>
                                      current._id === item.appointmentId
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

export default function App() {
  const [path, setPath] = useState(
    window.location.pathname
  );

  useEffect(() => {
    const sync = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener("popstate", sync);

    return () => {
      window.removeEventListener("popstate", sync);
    };
  }, []);

  const navigate = (next: string) => {
    window.history.pushState({}, "", next);
    setPath(next);
    window.scrollTo(0, 0);
  };

  const signedIn = Boolean(
    localStorage.getItem("carebridge_token")
  );

  if (path === "/portal" && !signedIn) {
    window.history.replaceState({}, "", "/");

    return (
      <Landing
        goPortal={() =>
          window.dispatchEvent(
            new Event("carebridge-auth")
          )
        }
      />
    );
  }

  return path === "/portal" ? (
    <Portal
      goHome={() => navigate("/")}
    />
  ) : (
    <Landing
      goPortal={() =>
        signedIn
          ? navigate("/portal")
          : window.dispatchEvent(
              new Event("carebridge-auth")
            )
      }
    />
  );
}