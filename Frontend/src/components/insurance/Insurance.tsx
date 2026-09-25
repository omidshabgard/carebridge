import { useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  FileText,
  Plus,
  ShieldCheck,
  X,
} from "lucide-react";

type Claim = {
  id: string;
  service: string;
  provider: string;
  date: string;
  billed: number;
  insurancePaid: number;
  patientResponsibility: number;
  status: "Processed" | "Pending";
};

const claims: Claim[] = [
  {
    id: "CL-84021",
    service: "Cardiology consultation",
    provider: "Dr. James Park",
    date: "Aug 28, 2026",
    billed: 260,
    insurancePaid: 218,
    patientResponsibility: 42,
    status: "Processed",
  },
  {
    id: "CL-83712",
    service: "Laboratory services",
    provider: "CareBridge Labs",
    date: "Aug 14, 2026",
    billed: 185,
    insurancePaid: 156.5,
    patientResponsibility: 28.5,
    status: "Processed",
  },
  {
    id: "CL-84690",
    service: "Primary care visit",
    provider: "Dr. Maya Chen",
    date: "Sep 12, 2026",
    billed: 175,
    insurancePaid: 0,
    patientResponsibility: 0,
    status: "Pending",
  },
];

export default function Insurance() {
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [showCard, setShowCard] = useState(false);
  const [showAddInsurance, setShowAddInsurance] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submitInsurance = () => {
    setSubmitted(true);
  };

  const closeAddInsurance = () => {
    setShowAddInsurance(false);
    setSubmitted(false);
  };

  return (
    <div className="insurance-page">
      <section className="insurance-hero">
        <div>
          <small>INSURANCE & COVERAGE</small>
          <h2>Your coverage</h2>
          <p>
            Review your health plan, member information, and recent insurance
            claims.
          </p>
        </div>

        <div className="insurance-active">
          <CheckCircle2 />
          <div>
            <span>Coverage status</span>
            <strong>Active</strong>
          </div>
        </div>
      </section>

      <section className="insurance-plan-card">
        <div className="insurance-plan-header">
          <span className="insurance-shield">
            <ShieldCheck />
          </span>

          <div>
            <small>PRIMARY INSURANCE</small>
            <h2>NorthStar Health PPO</h2>
            <p>Preferred Provider Organization</p>
          </div>

          <span className="insurance-active-badge">Active</span>
        </div>

        <div className="insurance-plan-details">
          <div>
            <span>Member ID</span>
            <strong>NSH-48021</strong>
          </div>

          <div>
            <span>Group number</span>
            <strong>GRP-9218</strong>
          </div>

          <div>
            <span>Plan year</span>
            <strong>2026</strong>
          </div>

          <div>
            <span>Plan type</span>
            <strong>PPO</strong>
          </div>
        </div>

        <div className="insurance-plan-actions">
          <button onClick={() => setShowCard(true)}>
            <CreditCard />
            View insurance card
          </button>

          <button onClick={() => setShowAddInsurance(true)}>
            <Plus />
            Add insurance
          </button>
        </div>
      </section>

      <section className="insurance-benefits">
        <article>
          <span>Annual deductible</span>
          <strong>$1,500</strong>
          <small>$640 met</small>

          <div className="insurance-progress">
            <i style={{ width: "43%" }} />
          </div>
        </article>

        <article>
          <span>Out-of-pocket maximum</span>
          <strong>$5,500</strong>
          <small>$1,120 used</small>

          <div className="insurance-progress">
            <i style={{ width: "20%" }} />
          </div>
        </article>

        <article>
          <span>Primary care copay</span>
          <strong>$25</strong>
          <small>Per office visit</small>
        </article>
      </section>

      <section className="insurance-claims">
        <div className="insurance-section-heading">
          <div>
            <h3>Recent claims</h3>
            <p>Track how your recent healthcare claims were processed.</p>
          </div>
        </div>

        <div className="insurance-claim-list">
          {claims.map((claim) => (
            <article key={claim.id}>
              <span className="insurance-file">
                <FileText />
              </span>

              <div className="insurance-claim-main">
                <h3>{claim.service}</h3>
                <p>{claim.provider}</p>
                <small>
                  {claim.date} • {claim.id}
                </small>
              </div>

              <div className="insurance-claim-amount">
                <span>Amount billed</span>
                <strong>${claim.billed.toFixed(2)}</strong>
              </div>

              <span
                className={`insurance-claim-status ${claim.status.toLowerCase()}`}
              >
                {claim.status}
              </span>

              <button
                className="insurance-details-button"
                onClick={() => setSelectedClaim(claim)}
              >
                View details
              </button>
            </article>
          ))}
        </div>
      </section>

      {selectedClaim && (
        <div
          className="insurance-modal-backdrop"
          onClick={() => setSelectedClaim(null)}
        >
          <div
            className="insurance-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="insurance-close"
              onClick={() => setSelectedClaim(null)}
            >
              <X />
            </button>

            <small>CLAIM DETAILS</small>
            <h2>{selectedClaim.service}</h2>
            <p>{selectedClaim.provider}</p>

            <div className="insurance-claim-breakdown">
              <div>
                <span>Amount billed</span>
                <strong>${selectedClaim.billed.toFixed(2)}</strong>
              </div>

              <div>
                <span>Insurance paid</span>
                <strong>${selectedClaim.insurancePaid.toFixed(2)}</strong>
              </div>

              <div>
                <span>Your responsibility</span>
                <strong>
                  ${selectedClaim.patientResponsibility.toFixed(2)}
                </strong>
              </div>
            </div>

            <div className="insurance-modal-meta">
              <span>Claim number</span>
              <strong>{selectedClaim.id}</strong>

              <span>Service date</span>
              <strong>{selectedClaim.date}</strong>

              <span>Status</span>
              <strong>{selectedClaim.status}</strong>
            </div>
          </div>
        </div>
      )}

      {showCard && (
        <div
          className="insurance-modal-backdrop"
          onClick={() => setShowCard(false)}
        >
          <div
            className="insurance-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="insurance-close"
              onClick={() => setShowCard(false)}
            >
              <X />
            </button>

            <small>DIGITAL INSURANCE CARD</small>

            <div className="insurance-digital-card">
              <ShieldCheck />

              <div>
                <span>NorthStar Health</span>
                <strong>PPO</strong>
              </div>

              <hr />

              <p>Member</p>
              <strong>Omid Shabgard</strong>

              <div className="insurance-card-grid">
                <span>
                  Member ID
                  <strong>NSH-48021</strong>
                </span>

                <span>
                  Group
                  <strong>GRP-9218</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddInsurance && (
        <div
          className="insurance-modal-backdrop"
          onClick={closeAddInsurance}
        >
          <div
            className="insurance-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button className="insurance-close" onClick={closeAddInsurance}>
              <X />
            </button>

            {!submitted ? (
              <>
                <small>ADD COVERAGE</small>
                <h2>Add insurance</h2>

                <div className="insurance-form">
                  <label>
                    Insurance company
                    <input placeholder="Insurance company" />
                  </label>

                  <label>
                    Member ID
                    <input placeholder="Member ID" />
                  </label>

                  <label>
                    Group number
                    <input placeholder="Group number" />
                  </label>
                </div>

                <button
                  className="insurance-primary"
                  onClick={submitInsurance}
                >
                  Submit insurance
                </button>
              </>
            ) : (
              <div className="insurance-success">
                <CheckCircle2 />
                <h2>Insurance submitted</h2>
                <p>
                  Your demo insurance information has been submitted for
                  review.
                </p>

                <button
                  className="insurance-primary"
                  onClick={closeAddInsurance}
                >
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