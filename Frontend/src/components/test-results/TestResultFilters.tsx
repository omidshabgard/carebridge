import {
  Search,
  SlidersHorizontal,
} from "lucide-react";

import type {
  TestResultStatus,
} from "../../services/testResultService";

export type TestResultFilter =
  | "all"
  | TestResultStatus;

type TestResultFiltersProps = {
  activeFilter: TestResultFilter;
  search: string;
  counts: {
    all: number;
    normal: number;
    followUp: number;
    abnormal: number;
    pending: number;
  };
  onFilterChange: (
    filter: TestResultFilter
  ) => void;
  onSearchChange: (
    value: string
  ) => void;
};

function TestResultFilters({
  activeFilter,
  search,
  counts,
  onFilterChange,
  onSearchChange,
}: TestResultFiltersProps) {
  const filters: {
    id: TestResultFilter;
    label: string;
    count: number;
  }[] = [
    {
      id: "all",
      label: "All results",
      count: counts.all,
    },
    {
      id: "normal",
      label: "Normal",
      count: counts.normal,
    },
    {
      id: "follow-up",
      label: "Needs follow-up",
      count: counts.followUp,
    },
    {
      id: "abnormal",
      label: "Abnormal",
      count: counts.abnormal,
    },
    {
      id: "pending",
      label: "Pending",
      count: counts.pending,
    },
  ];

  return (
    <section className="test-result-filters">
      <div className="test-result-filters__heading">
        <div>
          <SlidersHorizontal
            size={18}
          />

          <strong>
            Filter results
          </strong>
        </div>

        <span>
          Find a test by name,
          provider, or status
        </span>
      </div>

      <div className="test-result-filters__controls">
        <label className="test-result-search">
          <Search size={18} />

          <input
            type="search"
            value={search}
            placeholder="Search test results..."
            onChange={(event) =>
              onSearchChange(
                event.target.value
              )
            }
            aria-label="Search test results"
          />
        </label>

        <div
          className="test-result-filter-tabs"
          role="group"
          aria-label="Filter test results by status"
        >
          {filters.map(
            (filter) => (
              <button
                key={filter.id}
                type="button"
                className={
                  activeFilter ===
                  filter.id
                    ? "is-active"
                    : ""
                }
                onClick={() =>
                  onFilterChange(
                    filter.id
                  )
                }
              >
                <span>
                  {filter.label}
                </span>

                <i>
                  {filter.count}
                </i>
              </button>
            )
          )}
        </div>
      </div>
    </section>
  );
}

export default TestResultFilters;