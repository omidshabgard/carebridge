import type {
  HealthRecordType,
} from "../../services/healthRecordService";

export type HealthRecordFilter =
  | "All"
  | HealthRecordType;

type HealthRecordFiltersProps = {
  activeFilter: HealthRecordFilter;
  onFilterChange: (
    filter: HealthRecordFilter
  ) => void;
};

const filters: HealthRecordFilter[] = [
  "All",
  "Visit summary",
  "Procedure",
  "Immunization",
  "Diagnosis",
  "Hospital",
  "Other",
];

export default function HealthRecordFilters({
  activeFilter,
  onFilterChange,
}: HealthRecordFiltersProps) {
  return (
    <div
      className="health-record-filters"
      aria-label="Filter health records"
    >
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          className={
            activeFilter === filter
              ? "health-record-filters__button health-record-filters__button--active"
              : "health-record-filters__button"
          }
          onClick={() =>
            onFilterChange(filter)
          }
        >
          {filter === "Visit summary"
            ? "Visits"
            : filter === "Immunization"
              ? "Immunizations"
              : filter === "Diagnosis"
                ? "Diagnoses"
                : filter === "Hospital"
                  ? "Hospital"
                  : filter === "Procedure"
                    ? "Procedures"
                    : filter}
        </button>
      ))}
    </div>
  );
}