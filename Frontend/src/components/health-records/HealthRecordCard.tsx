import {
  Building2,
  ChevronRight,
  FileCheck2,
  FileHeart,
  Syringe,
  Stethoscope,
} from "lucide-react";

import type {
  HealthRecord,
  HealthRecordType,
} from "../../services/healthRecordService";

type HealthRecordCardProps = {
  record: HealthRecord;
  onOpen: (record: HealthRecord) => void;
};

function getRecordIcon(
  type: HealthRecordType
) {
  switch (type) {
    case "Immunization":
      return Syringe;

    case "Hospital":
      return Building2;

    case "Visit summary":
      return Stethoscope;

    case "Procedure":
      return FileCheck2;

    default:
      return FileHeart;
  }
}

function formatRecordDate(
  value: string
) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}

export default function HealthRecordCard({
  record,
  onOpen,
}: HealthRecordCardProps) {
  const Icon = getRecordIcon(
    record.type
  );

  return (
    <button
      type="button"
      className="health-record-card"
      onClick={() => onOpen(record)}
      aria-label={`Open ${record.title}`}
    >
      <span className="health-record-card__icon">
        <Icon size={21} />
      </span>

      <div className="health-record-card__content">
        <div className="health-record-card__top">
          <span className="health-record-card__type">
            {record.type}
          </span>

          <time
            dateTime={record.recordDate}
          >
            {formatRecordDate(
              record.recordDate
            )}
          </time>
        </div>

        <h3>{record.title}</h3>

        <p>{record.summary}</p>

        <div className="health-record-card__meta">
          <span>
            {record.providerName}
          </span>

          {record.facility && (
            <>
              <i aria-hidden="true" />

              <span>
                {record.facility}
              </span>
            </>
          )}

          {record.documentAvailable && (
            <>
              <i aria-hidden="true" />

              <span className="health-record-card__document">
                Document available
              </span>
            </>
          )}
        </div>
      </div>

      <span className="health-record-card__open">
        <ChevronRight size={20} />
      </span>
    </button>
  );
}