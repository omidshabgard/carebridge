import {
  Activity,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FlaskConical,
  Image,
  TestTube2,
  TriangleAlert,
} from "lucide-react";

import type {
  TestResult,
  TestResultStatus,
} from "../../services/testResultService";

type TestResultCardProps = {
  result: TestResult;
  onOpen: (result: TestResult) => void;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  ).format(new Date(`${date}T12:00:00`));
}

function getStatusLabel(
  status: TestResultStatus
) {
  switch (status) {
    case "normal":
      return "Normal";

    case "follow-up":
      return "Needs follow-up";

    case "abnormal":
      return "Abnormal";

    case "pending":
      return "Pending";

    default:
      return status;
  }
}

function getStatusIcon(
  status: TestResultStatus
) {
  switch (status) {
    case "normal":
      return <CheckCircle2 size={15} />;

    case "follow-up":
      return <Activity size={15} />;

    case "abnormal":
      return <TriangleAlert size={15} />;

    case "pending":
      return <Clock3 size={15} />;

    default:
      return null;
  }
}

function getCategoryIcon(
  category: TestResult["category"]
) {
  switch (category) {
    case "blood-work":
      return <TestTube2 size={22} />;

    case "imaging":
      return <Image size={22} />;

    case "urine":
      return <FlaskConical size={22} />;

    default:
      return <Activity size={22} />;
  }
}

function getCategoryLabel(
  category: TestResult["category"]
) {
  switch (category) {
    case "blood-work":
      return "Blood work";

    case "imaging":
      return "Imaging";

    case "urine":
      return "Urine test";

    default:
      return "Other";
  }
}

function TestResultCard({
  result,
  onOpen,
}: TestResultCardProps) {
  const measurementCount =
    result.measurements.length;

  const measurementsWithHistory =
    result.measurements.filter(
      (measurement) =>
        measurement.history &&
        measurement.history.length > 1
    ).length;

  return (
    <article
      className={`test-result-card test-result-card--${result.status}`}
    >
      <div className="test-result-card__top">
        <div className="test-result-card__identity">
          <div className="test-result-card__icon">
            {getCategoryIcon(
              result.category
            )}
          </div>

          <div>
            <span className="test-result-card__category">
              {getCategoryLabel(
                result.category
              )}
            </span>

            <h3>{result.name}</h3>
          </div>
        </div>

        <span
          className={`test-result-status test-result-status--${result.status}`}
        >
          {getStatusIcon(result.status)}

          {getStatusLabel(
            result.status
          )}
        </span>
      </div>

      <div className="test-result-card__meta">
        <span>
          <CalendarDays size={15} />

          {formatDate(result.date)}
        </span>

        <span>
          <FlaskConical size={15} />

          {measurementCount === 0
            ? "Report"
            : `${measurementCount} ${
                measurementCount === 1
                  ? "measurement"
                  : "measurements"
              }`}
        </span>
      </div>

      <p className="test-result-card__summary">
        {result.summary}
      </p>

      {measurementsWithHistory > 0 && (
        <div className="test-result-card__trend">
          <Activity size={15} />

          <span>
            {measurementsWithHistory === 1
              ? "Trend history available"
              : `Trend history available for ${measurementsWithHistory} measurements`}
          </span>
        </div>
      )}

      <div className="test-result-card__footer">
        <div>
          <span>Ordered by</span>

          <strong>
            {result.provider}
          </strong>
        </div>

        <button
          type="button"
          className="test-result-card__open"
          onClick={() =>
            onOpen(result)
          }
          aria-label={`View ${result.name} details`}
        >
          View details

          <ArrowRight size={16} />
        </button>
      </div>
    </article>
  );
}

export default TestResultCard;