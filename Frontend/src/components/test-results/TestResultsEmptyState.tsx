import {
  FileSearch,
  FlaskConical,
  SearchX,
} from "lucide-react";

type TestResultsEmptyStateProps = {
  hasResults: boolean;
  hasSearchOrFilter: boolean;
  onClear?: () => void;
};

function TestResultsEmptyState({
  hasResults,
  hasSearchOrFilter,
  onClear,
}: TestResultsEmptyStateProps) {
  if (
    hasResults &&
    hasSearchOrFilter
  ) {
    return (
      <section className="test-results-empty">
        <div className="test-results-empty__icon">
          <SearchX size={32} />
        </div>

        <h3>
          No matching results
        </h3>

        <p>
          We couldn't find any test
          results matching your current
          search or filter.
        </p>

        {onClear && (
          <button
            type="button"
            onClick={onClear}
          >
            Clear filters
          </button>
        )}
      </section>
    );
  }

  if (!hasResults) {
    return (
      <section className="test-results-empty">
        <div className="test-results-empty__icon">
          <FlaskConical
            size={32}
          />
        </div>

        <h3>
          No test results yet
        </h3>

        <p>
          When new laboratory or
          diagnostic results become
          available, they'll appear
          here.
        </p>

        <div className="test-results-empty__note">
          <FileSearch
            size={17}
          />

          <span>
            Your results will be
            organized by date and
            status.
          </span>
        </div>
      </section>
    );
  }

  return null;
}

export default TestResultsEmptyState;