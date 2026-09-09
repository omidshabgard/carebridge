import {
  Apple,
  ArrowRight,
  CalendarDays,
  CreditCard,
  FileText,
  Headphones,
  Heart,
  HeartPulse,
  Leaf,
  LockKeyhole,
  MessageCircle,
  Phone,
  Pill,
  PersonStanding,
  ShieldCheck,
  Smartphone,
  Stethoscope,
  UserRound,
} from "lucide-react";

export default function HomeExtras() {
  const openPortal = () => {
    const signedIn = Boolean(localStorage.getItem("carebridge_token"));

    if (signedIn) {
      window.location.assign("/portal");
      return;
    }

    window.dispatchEvent(new Event("carebridge-auth"));
  };

  return (
    <section className="home-extras" id="resources">
      <div className="extras-heading">
        <small>CARE BEYOND THE CLINIC</small>

        <h2>More ways to feel your best.</h2>

        <p>
          Helpful services designed around real life—from preventive care to
          support at home.
        </p>
      </div>

      <div className="extras-feature-grid">
        {/* CARE TEAM */}
        <article className="extra-feature extra-coral">
          <span className="extra-feature-icon">
            <Heart />
          </span>

          <div className="extra-feature-copy">
            <small>PERSONAL CARE</small>

            <h3>Meet your care team</h3>

            <p>
              Find experienced providers who listen, explain, and build a plan
              with you.
            </p>

            <a href="#care">
              Find a doctor
              <ArrowRight />
            </a>
          </div>

          <div className="extra-card-art extra-doctor-art" aria-hidden="true">
            <span className="doctor-head" />

            <span className="doctor-body">
              <Stethoscope />
            </span>
          </div>
        </article>

        {/* WELLNESS */}
        <article className="extra-feature extra-blue">
          <span className="extra-feature-icon">
            <PersonStanding />
          </span>

          <div className="extra-feature-copy">
            <small>WELLNESS</small>

            <h3>
              Small steps,
              <br />
              lasting change
            </h3>

            <p>
              Explore wellness guidance for sleep, nutrition, movement, and
              mental health.
            </p>

            <a href="#resources">
              Explore resources
              <ArrowRight />
            </a>
          </div>

          <div className="extra-card-art extra-wellness-art" aria-hidden="true">
            <span className="wellness-leaf wellness-leaf-one">
              <Leaf />
            </span>

            <span className="wellness-leaf wellness-leaf-two">
              <Leaf />
            </span>

            <span className="wellness-runner">
              <PersonStanding />
            </span>
          </div>
        </article>

        {/* ONLINE */}
        <article className="extra-feature extra-gold">
          <span className="extra-feature-icon">
            <Smartphone />
          </span>

          <div className="extra-feature-copy">
            <small>CAREBRIDGE ONLINE</small>

            <h3>
              Your health stays
              <br />
              connected
            </h3>

            <p>
              View appointments, results, medications, messages, and more.
            </p>

            <button type="button" onClick={openPortal}>
              Learn about the portal
              <ArrowRight />
            </button>
          </div>

          <div className="extra-card-art extra-phone-art" aria-hidden="true">
            <div className="mini-phone">
              <strong>CareBridge</strong>

              <span>
                <CalendarDays />
                Appointments
              </span>

              <span>
                <MessageCircle />
                Messages
              </span>

              <span>
                <FileText />
                Test results
              </span>

              <span>
                <Pill />
                Medications
              </span>
            </div>
          </div>
        </article>

        {/* HEALTHY LIVING */}
        <article className="extra-feature extra-green">
          <span className="extra-feature-icon">
            <Apple />
          </span>

          <div className="extra-feature-copy">
            <small>HEALTHY LIVING</small>

            <h3>Healthy Living</h3>

            <p>
              Tips, tools, and everyday programs to help you and your family
              live healthier.
            </p>

            <a href="#resources">
              See healthy living
              <ArrowRight />
            </a>
          </div>

          <div className="extra-card-art extra-food-art" aria-hidden="true">
            <span className="food-leaf food-leaf-one">
              <Leaf />
            </span>

            <span className="food-leaf food-leaf-two">
              <Leaf />
            </span>

            <div className="healthy-bowl">
              <span className="bowl-food bowl-food-one" />
              <span className="bowl-food bowl-food-two" />
              <span className="bowl-food bowl-food-three" />
              <span className="bowl-food bowl-food-four" />
            </div>

            <span className="food-apple">
              <Apple />
            </span>
          </div>
        </article>
      </div>

      {/* PATIENT TOOLS */}
      <div className="patient-tools-section">
        <div className="patient-tools-heading">
          <small>PATIENT TOOLS</small>

          <h3>Quick access to the things you do most.</h3>
        </div>

        <div className="patient-tools-bar">
          <button type="button" onClick={openPortal}>
            <CalendarDays />

            <span>
              <strong>Book appointment</strong>
              <small>Schedule online</small>
            </span>
          </button>

          <button type="button" onClick={openPortal}>
            <FileText />

            <span>
              <strong>View test results</strong>
              <small>Access your latest results</small>
            </span>
          </button>

          <button type="button" onClick={openPortal}>
            <MessageCircle />

            <span>
              <strong>Message care team</strong>
              <small>Stay in touch</small>
            </span>
          </button>

          <button type="button" onClick={openPortal}>
            <Pill />

            <span>
              <strong>Manage medications</strong>
              <small>Refill and review</small>
            </span>
          </button>

          <button type="button" onClick={openPortal}>
            <CreditCard />

            <span>
              <strong>Pay a bill</strong>
              <small>Quick and secure</small>
            </span>
          </button>

          <button
            type="button"
            className="patient-tools-portal"
            onClick={openPortal}
          >
            <UserRound />

            <span>
              <strong>Open patient portal</strong>

              <small>
                Go to your account
                <ArrowRight />
              </small>
            </span>
          </button>
        </div>
      </div>

      {/* SUPPORT BANNER */}
      <div className="community-banner support-banner">
        <div className="support-content">
          <small>NEED HELP?</small>

          <h2>We're Just a Call Away</h2>

          <p>
            Have questions or need assistance? Our care team is here to help —
            real people, real support.
          </p>

          <a className="support-call" href="tel:18881234567">
            <Phone />
            <strong>Call Now (888) 123-4567</strong>
          </a>

          <div className="support-features">
            <span>
              <Headphones />
              Live Support
            </span>

            <span>
              <ShieldCheck />
              Trusted Care
            </span>

            <span>
              <Heart />
              Here for You
            </span>
          </div>
        </div>

        <div className="support-phone" aria-hidden="true">
          <span className="phone-glow" />

          <span className="orbit orbit-one" />
          <span className="orbit orbit-two" />

          <div className="support-floating-icon support-heart-icon">
            <HeartPulse />
          </div>

          <div className="support-floating-icon support-medical-icon">+</div>

          <div className="support-floating-icon support-chat-icon">•••</div>

          <div className="phone-device">
            <div className="phone-notch" />

            <div className="phone-screen">
              <strong>CareBridge</strong>
              <small>Calling...</small>

              <div className="phone-controls">
                <span>◖</span>
                <span>•••</span>
                <span>⌁</span>
              </div>

              <span className="phone-end-call">
                <Phone />
              </span>
            </div>
          </div>
        </div>

        <div className="support-message">
          <HeartPulse />

          <h3>
            Your Health
            <br />
            Our Priority
          </h3>

          <span>
            SAME CARE.
            <br />
            A BRIGHTER
            <br />
            TOMORROW.
          </span>
        </div>
      </div>
    </section>
  );
}