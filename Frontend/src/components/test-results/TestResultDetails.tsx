import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  MessageCircle,
  Stethoscope,
  TriangleAlert,
} from "lucide-react";
import { useMemo, useState } from "react";

import type {
  TestMeasurement,
  TestResult,
  TestResultStatus,
} from "../../services/testResultService";

import ResultMeasurementTable from "./ResultMeasurementTable";
import TestResultTrendChart from "./TestResultTrendChart";

type TestResultDetailsProps = {
  result: TestResult;
  onBack: () => void;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  ).format(
    new Date(`${date}T12:00:00`)
  );
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
      return (
        <CheckCircle2 size={17} />
      );

    case "follow-up":
    case "abnormal":
      return (
        <TriangleAlert size={17} />
      );

    case "pending":
      return <Clock3 size={17} />;

    default:
      return null;
  }
}

function TestResultDetails({
  result,
  onBack,
}: TestResultDetailsProps) {
  const firstTrendMeasurement =
    useMemo(
      () =>
        result.measurements.find(
          (measurement) =>
            Boolean(
              measurement.history &&
                measurement.history
                  .length > 1
            )
        ) ?? null,
      [result]
    );

  const [
    selectedMeasurement,
    setSelectedMeasurement,
  ] = useState<TestMeasurement | null>(
    firstTrendMeasurement
  );

  function handleSelectMeasurement(
    measurement: TestMeasurement
  ) {
    setSelectedMeasurement(
      measurement
    );

    window.setTimeout(() => {
      document
        .getElementById(
          "test-result-trend-section"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }, 0);
  }

  return (
    <div className="test-result-details">
      <button
        type="button"
        className="test-result-back"
        onClick={onBack}
      >
        <ArrowLeft size={18} />

        Back to test results
      </button>

      <section className="test-result-details-hero">
        <div className="test-result-details-hero__main">
          <span className="test-result-details-hero__eyebrow">
            Test result
          </span>

          <h1>{result.name}</h1>

          <p>{result.summary}</p>

          <div className="test-result-details-hero__meta">
            <span>
              <CalendarDays
                size={16}
              />

              {formatDate(
                result.date
              )}
            </span>

            <span>
              <Stethoscope
                size={16}
              />

              {result.provider}
            </span>

            <span>
              <Building2
                size={16}
              />

              {result.facility}
            </span>
          </div>
        </div>

        <div className="test-result-details-hero__side">
          <span
            className={`test-result-status test-result-status--${result.status}`}
          >
            {getStatusIcon(
              result.status
            )}

            {getStatusLabel(
              result.status
            )}
          </span>

          <span className="test-result-details-hero__label">
            Overall status
          </span>
        </div>
      </section>

      <section className="test-result-details-actions">
        <div>
          <strong>
            Questions about your
            results?
          </strong>

          <span>
            You can contact your
            CareBridge care team.
          </span>
        </div>

        <div className="test-result-details-actions__buttons">
          <button
            type="button"
            className="test-result-action-button"
          >
            <MessageCircle
              size={17}
            />

            Ask about result
          </button>

          <button
            type="button"
            className="test-result-action-button test-result-action-button--secondary"
          >
            <Download size={17} />

            Download report
          </button>
        </div>
      </section>

      <ResultMeasurementTable
        measurements={
          result.measurements
        }
        selectedMeasurementId={
          selectedMeasurement?.id ??
          null
        }
        onSelectMeasurement={
          handleSelectMeasurement
        }
      />

      {selectedMeasurement && (
        <div
          id="test-result-trend-section"
          className="test-result-details__trend"
        >
          <TestResultTrendChart
            measurement={
              selectedMeasurement
            }
          />
        </div>
      )}

      {result.notes && (
        <section className="test-result-notes">
          <div className="test-result-notes__icon">
            <Stethoscope
              size={20}
            />
          </div>

          <div>
            <span>
              Care team note
            </span>

            <h3>
              About this result
            </h3>

            <p>
              {result.notes}
            </p>
          </div>
        </section>
      )}

      <section className="test-result-disclaimer">
        <strong>
          Understanding your results
        </strong>

        <p>
          Reference ranges can vary
          depending on the laboratory,
          testing method, and individual
          circumstances. Review questions
          about your results with your
          care team.
        </p>
      </section>
    </div>
  );
}

export default TestResultDetails;