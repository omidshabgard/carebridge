import { Pill, ChevronRight } from "lucide-react";
import type { Medication } from "../../services/medicationService";

type MedicationCardProps = {
  medication: Medication;
  onSelect: (medication: Medication) => void;
};

function MedicationCard({
  medication,
  onSelect,
}: MedicationCardProps) {
  return (
    <button
      type="button"
      className="row medication-card"
      onClick={() => onSelect(medication)}
    >
      <span className="med">
        <Pill />
      </span>

      <div className="medication-card-content">
        <b>{medication.name}</b>

        <p>
          {medication.dose} • {medication.instructions}
        </p>

        <small>
          {medication.active
            ? `${medication.remainingDays} days remaining`
            : "Cancelled"}
        </small>
      </div>

      <ChevronRight size={20} />
    </button>
  );
}

export default MedicationCard;