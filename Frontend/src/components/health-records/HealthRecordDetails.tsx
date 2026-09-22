import {
  ArrowLeft,
  Building2,
  CalendarDays,
  FileHeart,
  Stethoscope,
} from "lucide-react";

import type {
  HealthRecord,
} from "../../services/healthRecordService";

type HealthRecordDetailsProps = {
  record: HealthRecord;
  onBack: () => void;
};

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );
}

export default function HealthRecordDetails({
  record,
  onBack,
}: HealthRecordDetailsProps) {
  return (
    <section className="health-record-details">
      <button
        type="button"
        className="health-record-details__back"
        onClick={onBack}
      >
        <ArrowLeft size={18} />
        Back to health records
      </button>

      <div className="health-record-details__hero">
        <div className="health-record-details__hero-icon">
          <FileHeart size={28} />
        </div>

        <div>
          <span className="health-record-details__type">
            {record.type}
          </span>

          <h1>{record.title}</h1>

          <p>{record.summary}</p>
        </div>
      </div>

      <div className="health-record-details__grid">
        <article className="health-record-details__card">
          <div className="health-record-details__label">
            <CalendarDays size={18} />

            <span>Record date</span>
          </div>

          <strong>
            {formatDate(record.recordDate)}
          </strong>
        </article>

        <article className="health-record-details__card">
          <div className="health-record-details__label">
            <Stethoscope size={18} />

            <span>Provider</span>
          </div>

          <strong>
            {record.providerName}
          </strong>
        </article>

        {record.facility && (
          <article className="health-record-details__card">
            <div className="health-record-details__label">
              <Building2 size={18} />

              <span>Facility</span>
            </div>

            <strong>
              {record.facility}
            </strong>
          </article>
        )}
      </div>

      {record.diagnosis && (
        <article className="health-record-details__section">
          <small>DIAGNOSIS</small>

          <h2>Diagnosis</h2>

          <p>{record.diagnosis}</p>
        </article>
      )}

      <article className="health-record-details__section">
        <small>RECORD SUMMARY</small>

        <h2>About this record</h2>

        <p>{record.summary}</p>
      </article>

      {record.notes && (
        <article className="health-record-details__section">
          <small>CARE NOTES</small>

          <h2>Notes</h2>

          <p>{record.notes}</p>
        </article>
      )}

      {record.documentAvailable && (
        <div className="health-record-details__document">
          <FileHeart size={22} />

          <div>
            <strong>
              Supporting document available
            </strong>

            <p>
              A document is associated with
              this health record.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}