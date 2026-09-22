import {
  Activity,
  FileHeart,
  Search,
  ShieldCheck,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getHealthRecords,
  type HealthRecord,
} from "../../services/healthRecordService";

import HealthRecordCard from "./HealthRecordCard";
import HealthRecordDetails from "./HealthRecordDetails";
import HealthRecordFilters, {
  type HealthRecordFilter,
} from "./HealthRecordFilters";
import HealthRecordsEmptyState from "./HealthRecordsEmptyState";
import HealthRecordsSummary from "./HealthRecordsSummary";

type HealthRecordsProps = {
  show: (message: string) => void;
};

type SummaryMode =
  | "all"
  | "year"
  | "recent";

export default function HealthRecords({
  show,
}: HealthRecordsProps) {
  const [records, setRecords] = useState<
    HealthRecord[]
  >([]);

  const [selectedRecord, setSelectedRecord] =
    useState<HealthRecord | null>(null);

  const [query, setQuery] = useState("");

  const [activeFilter, setActiveFilter] =
    useState<HealthRecordFilter>("All");

  const [summaryMode, setSummaryMode] =
    useState<SummaryMode>("all");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  const loadRecords = useCallback(
    async () => {
      setLoading(true);
      setError(false);

      try {
        const data =
          await getHealthRecords();

        const sorted = [...data].sort(
          (a, b) =>
            new Date(
              b.recordDate
            ).getTime() -
            new Date(
              a.recordDate
            ).getTime()
        );

        setRecords(sorted);
      } catch (loadError) {
        console.error(
          "Unable to load health records:",
          loadError
        );

        setError(true);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadRecords();
  }, [loadRecords]);

  const filteredRecords = useMemo(() => {
    const normalizedQuery =
      query.trim().toLowerCase();

    const currentYear =
      new Date().getFullYear();

    const thirtyDaysAgo =
      new Date();

    thirtyDaysAgo.setDate(
      thirtyDaysAgo.getDate() - 30
    );

    return records.filter((record) => {
      const matchesCategory =
        activeFilter === "All" ||
        record.type === activeFilter;

      if (!matchesCategory) {
        return false;
      }

      const recordDate =
        new Date(record.recordDate);

      if (
        summaryMode === "year" &&
        recordDate.getFullYear() !==
          currentYear
      ) {
        return false;
      }

      if (
        summaryMode === "recent" &&
        recordDate < thirtyDaysAgo
      ) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const searchableText = [
        record.title,
        record.type,
        record.providerName,
        record.facility,
        record.summary,
        record.diagnosis,
        record.notes,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(
        normalizedQuery
      );
    });
  }, [
    records,
    query,
    activeFilter,
    summaryMode,
  ]);

  const resetRecordView = () => {
    setQuery("");
    setActiveFilter("All");
    setSummaryMode("all");
  };

  const handleShowAll = () => {
    resetRecordView();

    show("Showing all health records.");
  };

  const handleShowThisYear = () => {
    setQuery("");
    setActiveFilter("All");
    setSummaryMode("year");

    show(
      "Showing health records from this year."
    );
  };

  const handleShowRecent = () => {
    setQuery("");
    setActiveFilter("All");
    setSummaryMode("recent");

    show(
      "Showing records from the last 30 days."
    );
  };

  const handleFilterChange = (
    filter: HealthRecordFilter
  ) => {
    setActiveFilter(filter);
    setSummaryMode("all");

    show(
      filter === "All"
        ? "Showing all record categories."
        : `Showing ${filter.toLowerCase()} records.`
    );
  };

  if (selectedRecord) {
    return (
      <HealthRecordDetails
        record={selectedRecord}
        onBack={() =>
          setSelectedRecord(null)
        }
      />
    );
  }

  return (
    <section className="health-records">
      <div className="health-records__hero">
        <div className="health-records__hero-content">
          <div className="health-records__eyebrow">
            <span>
              <ShieldCheck size={16} />
            </span>

            PRIVATE & SECURE
          </div>

          <h1>Health Records</h1>

          <p>
            Your complete health history,
            organized in one secure place.
          </p>

          <div className="health-records__search">
            <Search size={20} />

            <input
              type="search"
              value={query}
              onChange={(event) =>
                setQuery(
                  event.target.value
                )
              }
              placeholder="Search records, visits, or providers..."
              aria-label="Search health records"
            />
          </div>
        </div>

        <div
          className="health-records__hero-visual"
          aria-hidden="true"
        >
          <div className="health-records__hero-orbit health-records__hero-orbit--one" />

          <div className="health-records__hero-orbit health-records__hero-orbit--two" />

          <div className="health-records__hero-icon">
            <FileHeart size={42} />
          </div>

          <span className="health-records__hero-dot health-records__hero-dot--one" />

          <span className="health-records__hero-dot health-records__hero-dot--two" />

          <span className="health-records__hero-dot health-records__hero-dot--three" />
        </div>
      </div>

      <HealthRecordsSummary
        records={records}
        onShowAll={handleShowAll}
        onShowThisYear={
          handleShowThisYear
        }
        onShowRecent={
          handleShowRecent
        }
      />

      <section className="health-records__records">
        <div className="health-records__records-heading">
          <div>
            <small>YOUR HISTORY</small>

            <h2>Health record history</h2>

            {!loading &&
              !error &&
              records.length > 0 && (
                <p>
                  {filteredRecords.length}{" "}
                  {filteredRecords.length ===
                  1
                    ? "record"
                    : "records"}{" "}
                  shown
                </p>
              )}
          </div>

          <HealthRecordFilters
            activeFilter={activeFilter}
            onFilterChange={
              handleFilterChange
            }
          />
        </div>

        {loading ? (
          <HealthRecordsEmptyState
            type="loading"
          />
        ) : error ? (
          <HealthRecordsEmptyState
            type="error"
            onRetry={() =>
              void loadRecords()
            }
          />
        ) : records.length === 0 ? (
          <HealthRecordsEmptyState
            type="empty"
          />
        ) : filteredRecords.length ===
          0 ? (
          <HealthRecordsEmptyState
            type="search"
          />
        ) : (
          <div className="health-records__list">
            {filteredRecords.map(
              (record) => (
                <HealthRecordCard
                  key={record._id}
                  record={record}
                  onOpen={
                    setSelectedRecord
                  }
                />
              )
            )}
          </div>
        )}
      </section>

      <aside className="health-records__activity-banner">
        <span>
          <Activity size={21} />
        </span>

        <div>
          <strong>
            Your record activity
          </strong>

          <p>
            Recent records are automatically
            organized by date so your newest
            health information stays easy to
            find.
          </p>
        </div>
      </aside>
    </section>
  );
}