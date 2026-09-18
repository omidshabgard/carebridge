import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FileText,
  MessageCircleWarning,
} from "lucide-react";

import type {
  TestResultSummary as TestResultSummaryData,
} from "../../services/testResultService";

type TestResultSummaryProps = {
  summary: TestResultSummaryData;
};

function getPercentage(
  value: number,
  total: number
) {
  if (total === 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

function TestResultSummary({
  summary,
}: TestResultSummaryProps) {
  const normalPercentage = getPercentage(
    summary.normal,
    summary.total
  );

  const followUpPercentage = getPercentage(
    summary.followUp,
    summary.total
  );

  const abnormalPercentage = getPercentage(
    summary.abnormal,
    summary.total
  );

  return (
    <section
      className="test-result-summary"
      aria-label="Test result summary"
    >
      <article className="test-summary-card test-summary-card--total">
        <div className="test-summary-icon">
          <FileText size={22} />
        </div>

        <div className="test-summary-content">
          <span>Total results</span>

          <strong>{summary.total}</strong>

          <small>
            Your available results
          </small>
        </div>
      </article>

      <article className="test-summary-card test-summary-card--normal">
        <div className="test-summary-icon">
          <CheckCircle2 size={22} />
        </div>

        <div className="test-summary-content">
          <span>Normal</span>

          <strong>{summary.normal}</strong>

          <small>
            {normalPercentage}% of results
          </small>
        </div>
      </article>

      <article className="test-summary-card test-summary-card--follow-up">
        <div className="test-summary-icon">
          <MessageCircleWarning size={22} />
        </div>

        <div className="test-summary-content">
          <span>Need follow-up</span>

          <strong>{summary.followUp}</strong>

          <small>
            {followUpPercentage}% of results
          </small>
        </div>
      </article>

      <article className="test-summary-card test-summary-card--abnormal">
        <div className="test-summary-icon">
          <AlertTriangle size={22} />
        </div>

        <div className="test-summary-content">
          <span>Abnormal</span>

          <strong>{summary.abnormal}</strong>

          <small>
            {abnormalPercentage}% of results
          </small>
        </div>
      </article>

      {summary.pending > 0 && (
        <article className="test-summary-card test-summary-card--pending">
          <div className="test-summary-icon">
            <Clock3 size={22} />
          </div>

          <div className="test-summary-content">
            <span>Pending</span>

            <strong>{summary.pending}</strong>

            <small>
              Results being processed
            </small>
          </div>
        </article>
      )}
    </section>
  );
}

export default TestResultSummary;