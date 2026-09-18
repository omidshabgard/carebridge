import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock3,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";

import type {
  TestMeasurement,
  TestResultStatus,
} from "../../services/testResultService";

type ResultMeasurementTableProps = {
  measurements: TestMeasurement[];
  selectedMeasurementId?: string | null;
  onSelectMeasurement?: (
    measurement: TestMeasurement
  ) => void;
};

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

function ResultMeasurementTable({
  measurements,
  selectedMeasurementId,
  onSelectMeasurement,
}: ResultMeasurementTableProps) {
  if (!measurements.length) {
    return (
      <section className="result-measurements-card">
        <div className="result-measurements-card__header">
          <div>
            <span>Test measurements</span>

            <h3>
              No measurement values
            </h3>
          </div>
        </div>

        <div className="result-measurements-empty">
          <Activity size={25} />

          <p>
            This result uses a report
            instead of individual
            measurement values.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="result-measurements-card">
      <div className="result-measurements-card__header">
        <div>
          <span>
            Test measurements
          </span>

          <h3>
            Your results
          </h3>
        </div>

        <small>
          {measurements.length}{" "}
          {measurements.length === 1
            ? "measurement"
            : "measurements"}
        </small>
      </div>

      <div className="result-measurements-table-wrap">
        <table className="result-measurements-table">
          <thead>
            <tr>
              <th>Measurement</th>

              <th>
                Your result
              </th>

              <th>
                Reference range
              </th>

              <th>Status</th>

              <th>
                Trend
              </th>
            </tr>
          </thead>

          <tbody>
            {measurements.map(
              (measurement) => {
                const hasTrend =
                  Boolean(
                    measurement
                      .history &&
                      measurement
                        .history!
                        .length > 1
                  );

                const isSelected =
                  selectedMeasurementId ===
                  measurement.id;

                return (
                  <tr
                    key={
                      measurement.id
                    }
                    className={
                      isSelected
                        ? "is-selected"
                        : ""
                    }
                  >
                    <td>
                      <div className="result-measurement-name">
                        <strong>
                          {measurement
                            .shortName ??
                            measurement.name}
                        </strong>

                        {measurement.shortName &&
                          measurement
                            .shortName !==
                            measurement.name && (
                            <span>
                              {
                                measurement.name
                              }
                            </span>
                          )}
                      </div>
                    </td>

                    <td>
                      <strong className="result-measurement-value">
                        {
                          measurement.value
                        }

                        {measurement.unit && (
                          <small>
                            {
                              measurement.unit
                            }
                          </small>
                        )}
                      </strong>
                    </td>

                    <td>
                      <span className="result-reference-range">
                        {
                          measurement
                            .referenceRange
                            .label
                        }
                      </span>
                    </td>

                    <td>
                      <span
                        className={`result-measurement-status result-measurement-status--${measurement.status}`}
                      >
                        {getStatusIcon(
                          measurement.status
                        )}

                        {getStatusLabel(
                          measurement.status
                        )}
                      </span>
                    </td>

                    <td>
                      {hasTrend ? (
                        <button
                          type="button"
                          className="result-trend-button"
                          onClick={() =>
                            onSelectMeasurement?.(
                              measurement
                            )
                          }
                        >
                          <TrendingUp
                            size={15}
                          />

                          View trend

                          <ArrowRight
                            size={14}
                          />
                        </button>
                      ) : (
                        <span className="result-no-trend">
                          Not enough data
                        </span>
                      )}
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>

      <div className="result-measurements-help">
        <Activity size={16} />

        <p>
          Results marked with{" "}
          <strong>
            View trend
          </strong>{" "}
          have previous measurements
          available for comparison.
        </p>
      </div>
    </section>
  );
}

export default ResultMeasurementTable;