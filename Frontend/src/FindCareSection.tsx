import {
  Heart,
  Hospital,
  MapPin,
  Pill,
  Search,
  Stethoscope,
  Users,
  Zap,
} from "lucide-react";

import "./styles/find-care.css";

export default function FindCareSection() {
  return (
    <section className="find-care-section" id="care">
      <div className="find-care-heading">
        <small>FIND CARE</small>

        <h2>Get the right care, right where you are.</h2>

        <p>
          Enter your location and choose a care type to find nearby providers,
          services, and availability.
        </p>
      </div>

      <div className="find-care-search-shell">
        <div className="find-care-search-box">
          <MapPin />

          <input
            type="text"
            placeholder="Enter city or ZIP code"
            aria-label="Enter city or ZIP code"
          />

          <button type="button">
            <Search />
            Search care
          </button>
        </div>
      </div>

      <div className="find-care-grid">
        <button
          type="button"
          className="find-care-card find-care-primary"
        >
          <span className="find-care-icon">
            <Stethoscope />
          </span>

          <div>
            <h3>Primary Care</h3>

            <p>
              Everyday health
              <br />
              for you and your family
            </p>
          </div>
        </button>

        <button
          type="button"
          className="find-care-card find-care-urgent"
        >
          <span className="find-care-icon">
            <Zap />
          </span>

          <div>
            <h3>Urgent Care</h3>

            <p>
              Same-day help
              <br />
              when you need it
            </p>
          </div>
        </button>

        <button
          type="button"
          className="find-care-card find-care-specialty"
        >
          <span className="find-care-icon">
            <Users />
          </span>

          <div>
            <h3>Specialty Care</h3>

            <p>
              Experts for your
              <br />
              specific needs
            </p>
          </div>
        </button>

        <button
          type="button"
          className="find-care-card find-care-hospital"
        >
          <span className="find-care-icon">
            <Hospital />
          </span>

          <div>
            <h3>Hospital Care</h3>

            <p>
              Advanced care
              <br />
              and services
            </p>
          </div>
        </button>

        <button
          type="button"
          className="find-care-card find-care-mental"
        >
          <span className="find-care-icon">
            <Heart />
          </span>

          <div>
            <h3>Mental Health</h3>

            <p>
              Support for a
              <br />
              healthier mind
            </p>
          </div>
        </button>

        <button
          type="button"
          className="find-care-card find-care-pharmacy"
        >
          <span className="find-care-icon">
            <Pill />
          </span>

          <div>
            <h3>Pharmacy</h3>

            <p>
              Refills, prescriptions
              <br />
              and medication support
            </p>
          </div>
        </button>
      </div>
    </section>
  );
}