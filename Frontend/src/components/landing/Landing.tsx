import {
  Activity,
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Clock,
  HeartPulse,
  Hospital,
  LogOut,
  MapPin,
  Phone,
  Stethoscope,
  UserRound,
} from "lucide-react";

import AboutSection from "../../AboutSection";
import FindCareSection from "../../FindCareSection";
import Brand from "../layout/Brand";

type LandingProps = {
  goPortal: () => void;
  signedIn: boolean;
  signOut: () => void;
};

export default function Landing({
  goPortal,
  signedIn,
  signOut,
}: LandingProps) {
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
              localStorage.setItem(
                "carebridge_portal_section",
                "Appointments"
              );
              goPortal();
            }}
          >
            <CalendarDays />
            Schedule an appointment
          </button>

          {signedIn ? (
            <>
              <button
                className="patient-portal-header-button"
                onClick={goPortal}
              >
                <UserRound />
                Patient Portal
              </button>

              <button
                className="header-signout-button"
                onClick={signOut}
              >
                <LogOut />
                Sign out
              </button>
            </>
          ) : (
            <button
              className="header-signin-button"
              onClick={goPortal}
            >
              <UserRound />
              Sign in
            </button>
          )}
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