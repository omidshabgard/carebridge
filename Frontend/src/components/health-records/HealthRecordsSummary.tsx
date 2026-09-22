import {
  Activity,
  CalendarDays,
  FileHeart,
} from "lucide-react";

import type {
  HealthRecord,
} from "../../services/healthRecordService";

type HealthRecordsSummaryProps = {
  records: HealthRecord[];
  onShowAll: () => void;
  onShowThisYear: () => void;
  onShowRecent: () => void;
};

export default function HealthRecordsSummary({
  records,
  onShowAll,
  onShowThisYear,
  onShowRecent,
}: HealthRecordsSummaryProps) {
  const currentYear =
    new Date().getFullYear();

  const thisYearCount = records.filter(
    (record) =>
      new Date(
        record.recordDate
      ).getFullYear() === currentYear
  ).length;

  const recentCount = records.filter(
    (record) => {
      const recordDate = new Date(
        record.recordDate
      );

      const thirtyDaysAgo = new Date();

      thirtyDaysAgo.setDate(
        thirtyDaysAgo.getDate() - 30
      );

      return recordDate >= thirtyDaysAgo;
    }
  ).length;

  return (
    <div className="health-records__summary">
      <button
        type="button"
        className="health-records__summary-card"
        onClick={onShowAll}
      >
        <span className="health-records__summary-icon health-records__summary-icon--blue">
          <FileHeart size={22} />
        </span>

        <div>
          <small>Total records</small>

          <strong>{records.length}</strong>

          <p>
            Your complete record history
          </p>
        </div>
      </button>

      <button
        type="button"
        className="health-records__summary-card"
        onClick={onShowThisYear}
      >
        <span className="health-records__summary-icon health-records__summary-icon--mint">
          <CalendarDays size={22} />
        </span>

        <div>
          <small>This year</small>

          <strong>{thisYearCount}</strong>

          <p>
            Records added this year
          </p>
        </div>
      </button>

      <button
        type="button"
        className="health-records__summary-card"
        onClick={onShowRecent}
      >
        <span className="health-records__summary-icon health-records__summary-icon--violet">
          <Activity size={22} />
        </span>

        <div>
          <small>Recent activity</small>

          <strong>{recentCount}</strong>

          <p>
            Updated in the last 30 days
          </p>
        </div>
      </button>
    </div>
  );
}