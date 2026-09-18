import {
  Activity,
  ArrowLeft,
  FlaskConical,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getTestResults,
  getTestResultSummary,
  type TestResult,
  type TestResultSummary as TestResultSummaryData,
} from "../../services/testResultService";

import TestResultCard from "./TestResultCard";
import TestResultDetails from "./TestResultDetails";
import TestResultFilters, {
  type TestResultFilter,
} from "./TestResultFilters";
import TestResultSummary from "./TestResultSummary";
import TestResultsEmptyState from "./TestResultsEmptyState";

type TestResultsProps = {
  show?: (message: string) => void;
  showBackToOverview?: boolean;
  onBackToOverview?: () => void;
};

const emptySummary: TestResultSummaryData = {
  total: 0,
  normal: 0,
  followUp: 0,
  abnormal: 0,
  pending: 0,
};

function TestResults({
  show,
  showBackToOverview = false,
  onBackToOverview,
}: TestResultsProps) {
  const [results, setResults] =
    useState<TestResult[]>([]);

  const [summary, setSummary] =
    useState<TestResultSummaryData>(
      emptySummary
    );

  const [
    selectedResult,
    setSelectedResult,
  ] = useState<TestResult | null>(
    null
  );

  const [
    activeFilter,
    setActiveFilter,
  ] = useState<TestResultFilter>(
    "all"
  );

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadResults() {
    try {
      setLoading(true);
      setError("");

      const [
        resultData,
        summaryData,
      ] = await Promise.all([
        getTestResults(),
        getTestResultSummary(),
      ]);

      setResults(resultData);
      setSummary(summaryData);
    } catch {
      setError(
        "Unable to load your test results."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadResults();
  }, []);

  const filteredResults =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return results.filter(
        (result) => {
          const matchesFilter =
            activeFilter ===
              "all" ||
            result.status ===
              activeFilter;

          if (!matchesFilter) {
            return false;
          }

          if (!normalizedSearch) {
            return true;
          }

          const searchableText = [
            result.name,
            result.provider,
            result.facility,
            result.category,
            result.status,
            result.summary,
          ]
            .join(" ")
            .toLowerCase();

          return searchableText.includes(
            normalizedSearch
          );
        }
      );
    }, [
      results,
      search,
      activeFilter,
    ]);

  const counts = useMemo(
    () => ({
      all: summary.total,
      normal: summary.normal,
      followUp:
        summary.followUp,
      abnormal:
        summary.abnormal,
      pending:
        summary.pending,
    }),
    [summary]
  );

  function handleOpenResult(
    result: TestResult
  ) {
    setSelectedResult(result);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleBack() {
    setSelectedResult(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleClearFilters() {
    setSearch("");
    setActiveFilter("all");
  }

  if (selectedResult) {
    return (
      <TestResultDetails
        result={selectedResult}
        onBack={handleBack}
      />
    );
  }

  if (loading) {
    return (
      <div className="test-results-loading">
        <div className="test-results-loading__card">
          <span />

          <FlaskConical
            size={24}
          />

          <strong>
            Loading test results...
          </strong>
        </div>
      </div>
    );
  }

  return (
    <div className="test-results-page">
      {showBackToOverview &&
        onBackToOverview && (
          <button
            type="button"
            className="test-results-overview-back"
            onClick={onBackToOverview}
          >
            <ArrowLeft size={16} />
            Back to Overview
          </button>
        )}

      {error && (
        <div
          className="test-results-error"
          role="alert"
        >
          <span>{error}</span>

          <button
            type="button"
            onClick={() =>
              void loadResults()
            }
          >
            Try again
          </button>
        </div>
      )}

      <section className="test-results-hero">
        <div className="test-results-hero__content">
          <span className="test-results-hero__eyebrow">
            <ShieldCheck
              size={17}
            />

            Secure health records
          </span>

          <h1>Test Results</h1>

          <p>
            Review your latest
            laboratory and diagnostic
            results, follow changes
            over time, and stay
            connected with your care
            team.
          </p>

          <div className="test-results-hero__features">
            <span>
              <Activity
                size={16}
              />

              Track trends over
              time
            </span>

            <span>
              <FlaskConical
                size={16}
              />

              Review detailed
              measurements
            </span>

            <span>
              <MessageCircle
                size={16}
              />

              Ask your care team
            </span>
          </div>
        </div>

        <div
          className="test-results-hero__visual"
          aria-hidden="true"
        >
          <div className="test-results-hero__visual-main">
            <Sparkles size={22} />

            <strong>
              Understand your health
              trends
            </strong>

            <span>
              Compare current and
              previous results
            </span>
          </div>

          <div className="test-results-mini-chart">
            <span
              style={{
                height: "34%",
              }}
            />

            <span
              style={{
                height: "48%",
              }}
            />

            <span
              style={{
                height: "62%",
              }}
            />

            <span
              style={{
                height: "74%",
              }}
            />

            <span
              style={{
                height: "88%",
              }}
            />
          </div>
        </div>
      </section>

      <TestResultSummary
        summary={summary}
      />

      <section className="test-results-main-heading">
        <div>
          <span>
            Your health records
          </span>

          <h2>
            Recent test results
          </h2>

          <p>
            Select any result to see
            measurements, reference
            ranges, historical trends,
            and care-team notes.
          </p>
        </div>

        <div className="test-results-main-heading__count">
          <strong>
            {filteredResults.length}
          </strong>

          <span>
            {filteredResults.length ===
            1
              ? "result shown"
              : "results shown"}
          </span>
        </div>
      </section>

      <TestResultFilters
        activeFilter={
          activeFilter
        }
        search={search}
        counts={counts}
        onFilterChange={
          setActiveFilter
        }
        onSearchChange={
          setSearch
        }
      />

      {filteredResults.length >
      0 ? (
        <section className="test-results-grid">
          {filteredResults.map(
            (result) => (
              <TestResultCard
                key={result.id}
                result={result}
                onOpen={
                  handleOpenResult
                }
              />
            )
          )}
        </section>
      ) : (
        <TestResultsEmptyState
          hasResults={
            results.length > 0
          }
          hasSearchOrFilter={
            Boolean(
              search.trim()
            ) ||
            activeFilter !==
              "all"
          }
          onClear={
            handleClearFilters
          }
        />
      )}

      <section className="test-results-help-card">
        <div className="test-results-help-card__icon">
          <MessageCircle
            size={23}
          />
        </div>

        <div>
          <span>
            Need help understanding
            a result?
          </span>

          <h3>
            Your care team can help.
          </h3>

          <p>
            Use CareBridge secure
            messaging when you have
            questions about a test
            result or follow-up plan.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            show?.(
              "Secure messaging is available from Messages."
            )
          }
        >
          Ask about a result
        </button>
      </section>
    </div>
  );
}

export default TestResults;