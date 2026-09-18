import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

import type {
  TestMeasurement,
} from "../../services/testResultService";

type TestResultTrendChartProps = {
  measurement: TestMeasurement;
};

function formatShortDate(
  date: string
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      year: "2-digit",
    }
  ).format(
    new Date(`${date}T12:00:00`)
  );
}

function TestResultTrendChart({
  measurement,
}: TestResultTrendChartProps) {
  const history =
    measurement.history ?? [];

  if (history.length < 2) {
    return null;
  }

  const values = history.map(
    (point) => point.value
  );

  const firstPoint = history[0];
  const latestPoint =
    history[history.length - 1];

  const difference =
    latestPoint.value -
    firstPoint.value;

  const trendDirection =
    difference > 0
      ? "up"
      : difference < 0
        ? "down"
        : "stable";

  const rangeMin =
    measurement.referenceRange.min;

  const rangeMax =
    measurement.referenceRange.max;

  const referenceValues = [
    ...values,
  ];

  if (rangeMin !== undefined) {
    referenceValues.push(rangeMin);
  }

  if (rangeMax !== undefined) {
    referenceValues.push(rangeMax);
  }

  const rawMin = Math.min(
    ...referenceValues
  );

  const rawMax = Math.max(
    ...referenceValues
  );

  const rawSpread =
    rawMax - rawMin || 1;

  const padding =
    rawSpread * 0.2;

  const chartMin = Math.max(
    0,
    rawMin - padding
  );

  const chartMax =
    rawMax + padding;

  const chartRange =
    chartMax - chartMin || 1;

  const width = 760;
  const height = 250;

  const paddingLeft = 45;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 45;

  const plotWidth =
    width -
    paddingLeft -
    paddingRight;

  const plotHeight =
    height -
    paddingTop -
    paddingBottom;

  function getX(index: number) {
    if (history.length === 1) {
      return (
        paddingLeft +
        plotWidth / 2
      );
    }

    return (
      paddingLeft +
      (index /
        (history.length - 1)) *
        plotWidth
    );
  }

  function getY(value: number) {
    return (
      paddingTop +
      ((chartMax - value) /
        chartRange) *
        plotHeight
    );
  }

  const points = history
    .map(
      (point, index) =>
        `${getX(index)},${getY(
          point.value
        )}`
    )
    .join(" ");

  const normalRangeTop =
    rangeMax !== undefined
      ? getY(rangeMax)
      : paddingTop;

  const normalRangeBottom =
    rangeMin !== undefined
      ? getY(rangeMin)
      : paddingTop +
        plotHeight;

  const normalRangeHeight =
    Math.max(
      0,
      normalRangeBottom -
        normalRangeTop
    );

  const differenceText =
    Math.abs(difference).toLocaleString(
      "en-US",
      {
        maximumFractionDigits: 2,
      }
    );

  return (
    <section className="test-trend-card">
      <div className="test-trend-card__header">
        <div>
          <span className="test-trend-card__eyebrow">
            <TrendingUp
              size={16}
            />

            Historical trend
          </span>

          <h3>
            {measurement.shortName ??
              measurement.name}
          </h3>

          <p>
            See how this result has
            changed over time.
          </p>
        </div>

        <div className="test-trend-latest">
          <span>Latest result</span>

          <strong>
            {latestPoint.value}{" "}
            {measurement.unit}
          </strong>

          <small>
            {formatShortDate(
              latestPoint.date
            )}
          </small>
        </div>
      </div>

      <div className="test-trend-change">
        <div
          className={`test-trend-change__icon test-trend-change__icon--${trendDirection}`}
        >
          {trendDirection ===
          "up" ? (
            <ArrowUpRight
              size={18}
            />
          ) : trendDirection ===
            "down" ? (
            <ArrowDownRight
              size={18}
            />
          ) : (
            <ArrowRight
              size={18}
            />
          )}
        </div>

        <div>
          <span>
            {trendDirection ===
            "up"
              ? "Increased"
              : trendDirection ===
                  "down"
                ? "Decreased"
                : "No change"}
          </span>

          <strong>
            {differenceText}{" "}
            {measurement.unit}
          </strong>

          <small>
            since{" "}
            {formatShortDate(
              firstPoint.date
            )}
          </small>
        </div>
      </div>

      <div className="test-trend-chart">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`${measurement.name} historical result chart`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id={`trendArea-${measurement.id}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="currentColor"
                stopOpacity="0.2"
              />

              <stop
                offset="100%"
                stopColor="currentColor"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          {rangeMin !==
            undefined &&
            rangeMax !==
              undefined && (
              <rect
                className="test-trend-normal-range"
                x={paddingLeft}
                y={normalRangeTop}
                width={plotWidth}
                height={
                  normalRangeHeight
                }
                rx="8"
              />
            )}

          {[0, 1, 2, 3].map(
            (line) => {
              const y =
                paddingTop +
                (plotHeight / 3) *
                  line;

              return (
                <line
                  key={line}
                  className="test-trend-grid-line"
                  x1={paddingLeft}
                  y1={y}
                  x2={
                    width -
                    paddingRight
                  }
                  y2={y}
                />
              );
            }
          )}

          <polygon
            className="test-trend-area"
            points={`${paddingLeft},${
              paddingTop +
              plotHeight
            } ${points} ${
              width -
              paddingRight
            },${
              paddingTop +
              plotHeight
            }`}
            fill={`url(#trendArea-${measurement.id})`}
          />

          <polyline
            className="test-trend-line"
            points={points}
            fill="none"
          />

          {history.map(
            (point, index) => (
              <g
                key={`${point.date}-${point.value}`}
              >
                <circle
                  className="test-trend-point-ring"
                  cx={getX(index)}
                  cy={getY(
                    point.value
                  )}
                  r="8"
                />

                <circle
                  className="test-trend-point"
                  cx={getX(index)}
                  cy={getY(
                    point.value
                  )}
                  r="4.5"
                />

                <text
                  className="test-trend-value"
                  x={getX(index)}
                  y={
                    getY(
                      point.value
                    ) - 16
                  }
                  textAnchor="middle"
                >
                  {point.value}
                </text>

                <text
                  className="test-trend-date"
                  x={getX(index)}
                  y={
                    height - 14
                  }
                  textAnchor="middle"
                >
                  {formatShortDate(
                    point.date
                  )}
                </text>
              </g>
            )
          )}
        </svg>
      </div>

      <div className="test-trend-footer">
        <div className="test-trend-legend">
          <span>
            <i className="test-trend-legend__line" />
            Your results
          </span>

          {rangeMin !==
            undefined &&
            rangeMax !==
              undefined && (
              <span>
                <i className="test-trend-legend__range" />
                Reference range
              </span>
            )}
        </div>

        <div className="test-trend-reference">
          <span>
            Reference range
          </span>

          <strong>
            {
              measurement
                .referenceRange
                .label
            }
          </strong>
        </div>
      </div>
    </section>
  );
}

export default TestResultTrendChart;