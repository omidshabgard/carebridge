import {
  FileHeart,
  LoaderCircle,
  SearchX,
  TriangleAlert,
} from "lucide-react";

type EmptyStateType =
  | "loading"
  | "empty"
  | "search"
  | "error";

type HealthRecordsEmptyStateProps = {
  type: EmptyStateType;
  onRetry?: () => void;
};

export default function HealthRecordsEmptyState({
  type,
  onRetry,
}: HealthRecordsEmptyStateProps) {
  if (type === "loading") {
    return (
      <div className="health-records-state">
        <span className="health-records-state__icon">
          <LoaderCircle
            className="health-records-state__spinner"
            size={30}
          />
        </span>

        <h3>Loading health records</h3>

        <p>
          We're securely retrieving your
          health history.
        </p>
      </div>
    );
  }

  if (type === "error") {
    return (
      <div className="health-records-state">
        <span className="health-records-state__icon health-records-state__icon--error">
          <TriangleAlert size={30} />
        </span>

        <h3>We couldn't load your records</h3>

        <p>
          There was a problem retrieving
          your health information.
        </p>

        {onRetry && (
          <button
            type="button"
            className="health-records-state__retry"
            onClick={onRetry}
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  if (type === "search") {
    return (
      <div className="health-records-state">
        <span className="health-records-state__icon">
          <SearchX size={30} />
        </span>

        <h3>No matching records</h3>

        <p>
          Try another search or choose a
          different record category.
        </p>
      </div>
    );
  }

  return (
    <div className="health-records-state">
      <span className="health-records-state__icon">
        <FileHeart size={30} />
      </span>

      <h3>No health records yet</h3>

      <p>
        Your visits, procedures,
        immunizations, diagnoses, and other
        medical records will appear here.
      </p>
    </div>
  );
}