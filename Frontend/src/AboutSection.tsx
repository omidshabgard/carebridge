import "./styles/about.css";
import aboutFamily from "./assets/about-family.png";

import {
  HeartHandshake,
  Link2,
  ShieldCheck,
} from "lucide-react";

export default function AboutSection() {
  return (
    <section className="about-section" id="about">
      <div className="about-heading">
        <small>ABOUT CAREBRIDGE</small>

        <h2>
          Healthcare should feel personal, simple, and connected.
        </h2>

        <p>
          CareBridge brings patients, providers, and health information
          together—making it easier to get care, understand your health, and
          stay connected with the people who care for you.
        </p>
      </div>

      <div className="about-content">
        <div className="about-image">
          <img
            src=  {aboutFamily}
            alt="Father and daughter spending time together"
          />

          <div className="about-image-message">
            <strong>
              People
              <br />
              Healthier
              <br />
              Together
            </strong>

            <HeartHandshake />
          </div>
        </div>

        <div className="about-values">
          <article>
            <span className="about-value-icon about-value-green">
              <HeartHandshake />
            </span>

            <div>
              <h3>People first</h3>

              <p>
                We design every experience around patients and the people who
                support their health.
              </p>
            </div>
          </article>

          <article>
            <span className="about-value-icon about-value-blue">
              <Link2 />
            </span>

            <div>
              <h3>Connected care</h3>

              <p>
                Your care team, records, appointments, and communication work
                together in one place.
              </p>
            </div>
          </article>

          <article>
            <span className="about-value-icon about-value-coral">
              <ShieldCheck />
            </span>

            <div>
              <h3>Privacy built in</h3>

              <p>
                Your health information deserves thoughtful protection,
                secure access, and clear control.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}