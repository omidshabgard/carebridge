import { FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Edit3,
  FileText,
  Pill,
  Save,
  Trash2,
  XCircle,
} from "lucide-react";

import MedicationCard from "./MedicationCard";

import {
  cancelMedication,
  createMedication,
  deleteMedication,
  getMedications,
  markMedicationTaken,
  updateMedication,
  type Medication,
} from "../../services/medicationService";

type MedicationsProps = {
  show: (message: string) => void;
};

const DOSE_UNITS = ["mg", "mcg", "g", "mL", "IU"];

const INSTRUCTION_OPTIONS = [
  "Take once daily",
  "Take twice daily",
  "Take three times daily",
  "Take once daily in the morning",
  "Take once daily at night",
  "Take once a week",
  "Take as needed",
  "Other",
];

function splitDose(dose: string) {
  const trimmed = dose.trim();

  const match = trimmed.match(
    /^(.+?)\s*(mg|mcg|g|mL|IU)$/i
  );

  if (!match) {
    return {
      value: trimmed,
      unit: "mg",
    };
  }

  const rawUnit = match[2].toLowerCase();

  const normalizedUnit =
    rawUnit === "ml"
      ? "mL"
      : rawUnit === "iu"
        ? "IU"
        : rawUnit;

  return {
    value: match[1].trim(),
    unit: normalizedUnit,
  };
}

function Medications({ show }: MedicationsProps) {
  const [medications, setMedications] = useState<Medication[]>([]);

  const [selectedMedication, setSelectedMedication] =
    useState<Medication | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingMedication, setEditingMedication] =
    useState<Medication | null>(null);

  const [name, setName] = useState("");

  const [doseValue, setDoseValue] = useState("");
  const [doseUnit, setDoseUnit] = useState("mg");

  const [instructions, setInstructions] = useState("");

  const [customInstructions, setCustomInstructions] =
    useState("");

  const [remainingDays, setRemainingDays] = useState("30");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadMedications() {
      try {
        setLoading(true);
        setError("");

        const data = await getMedications();

        setMedications(data);
      } catch (error) {
        console.error(error);

        setError("Unable to load medications.");
      } finally {
        setLoading(false);
      }
    }

    loadMedications();
  }, []);

  function resetForm() {
    setName("");

    setDoseValue("");
    setDoseUnit("mg");

    setInstructions("");
    setCustomInstructions("");

    setRemainingDays("30");

    setEditingMedication(null);
    setShowForm(false);
  }

  function handleAddMedication() {
    setSelectedMedication(null);
    setEditingMedication(null);

    setName("");

    setDoseValue("");
    setDoseUnit("mg");

    setInstructions("");
    setCustomInstructions("");

    setRemainingDays("30");

    setShowForm(true);
  }

  function handleSelectMedication(medication: Medication) {
    setSelectedMedication(medication);
    setShowForm(false);
    setEditingMedication(null);
  }

  function handleEditMedication(medication: Medication) {
    setEditingMedication(medication);

    setName(medication.name);

    const parsedDose = splitDose(medication.dose);

    setDoseValue(parsedDose.value);
    setDoseUnit(parsedDose.unit);

    if (
      INSTRUCTION_OPTIONS.includes(
        medication.instructions
      )
    ) {
      setInstructions(medication.instructions);
      setCustomInstructions("");
    } else {
      setInstructions("Other");
      setCustomInstructions(medication.instructions);
    }

    setRemainingDays(
      String(medication.remainingDays)
    );

    setShowForm(true);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const finalDose =
      `${doseValue.trim()} ${doseUnit}`.trim();

    const finalInstructions =
      instructions === "Other"
        ? customInstructions.trim()
        : instructions.trim();

    if (!finalInstructions) {
      setError(
        "Please enter medication instructions."
      );

      return;
    }

    try {
      setSaving(true);
      setError("");

      if (editingMedication) {
        const updatedMedication =
          await updateMedication(
            editingMedication._id,
            {
              name: name.trim(),
              dose: finalDose,
              instructions: finalInstructions,
              remainingDays:
                Number(remainingDays),
            }
          );

        setMedications((current) =>
          current.map((item) =>
            item._id === updatedMedication._id
              ? updatedMedication
              : item
          )
        );

        setSelectedMedication(
          updatedMedication
        );

        show(
          "Medication updated successfully."
        );
      } else {
        const medication =
          await createMedication({
            name: name.trim(),
            dose: finalDose,
            instructions: finalInstructions,
            remainingDays:
              Number(remainingDays),
          });

        setMedications((current) => [
          medication,
          ...current,
        ]);

        show(
          "Medication added successfully."
        );
      }

      resetForm();
    } catch (error) {
      console.error(error);

      setError(
        editingMedication
          ? "Unable to update medication."
          : "Unable to add medication."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleMarkTaken(
    medication: Medication
  ) {
    try {
      setError("");

      const updatedMedication =
        await markMedicationTaken(
          medication._id
        );

      setMedications((current) =>
        current.map((item) =>
          item._id === updatedMedication._id
            ? updatedMedication
            : item
        )
      );

      setSelectedMedication(
        updatedMedication
      );

      show(
        `${medication.name} marked as taken.`
      );
    } catch (error) {
      console.error(error);

      setError(
        "Unable to mark medication as taken."
      );
    }
  }

  async function handleCancelMedication(
    medication: Medication
  ) {
    try {
      setError("");

      const updatedMedication =
        await cancelMedication(
          medication._id
        );

      setMedications((current) =>
        current.map((item) =>
          item._id === updatedMedication._id
            ? updatedMedication
            : item
        )
      );

      setSelectedMedication(
        updatedMedication
      );

      show(
        `${medication.name} cancelled.`
      );
    } catch (error) {
      console.error(error);

      setError(
        "Unable to cancel medication."
      );
    }
  }

  async function handleDeleteMedication(
    medication: Medication
  ) {
    if (medication.active) {
      setError(
        "Active medications cannot be permanently deleted."
      );

      return;
    }

    const confirmed = window.confirm(
      `Permanently delete ${medication.name}? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteMedication(
        medication._id
      );

      setMedications((current) =>
        current.filter(
          (item) =>
            item._id !== medication._id
        )
      );

      setSelectedMedication(null);

      show(
        `${medication.name} deleted permanently.`
      );
    } catch (error) {
      console.error(error);

      setError(
        "Unable to delete medication."
      );
    }
  }

  if (loading) {
    return (
      <div className="item-list">
        <div className="empty">
          Loading medications...
        </div>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="empty">
          {error}
        </div>
      )}

      {/* ADD / EDIT MEDICATION */}

      {showForm && (
        <form
          className="appointment-form medication-form"
          onSubmit={handleSubmit}
        >
          <div className="medication-form-header">
            <div className="medication-form-icon">
              <Pill size={25} />
            </div>

            <div>
              <h3>
                {editingMedication
                  ? "Edit medication"
                  : "Add medication"}
              </h3>

              <p>
                {editingMedication
                  ? "Update your medication information."
                  : "Add medication details to your health record."}
              </p>
            </div>
          </div>

          <div className="medication-form-grid">
            {/* MEDICATION NAME */}

            <label className="medication-field">
              <span>Medication name</span>

              <div className="medication-input-wrap">
                <Pill size={18} />

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Vitamin D"
                  required
                />
              </div>
            </label>

            {/* DOSE */}

            <label className="medication-field">
              <span>Dose / Strength</span>

              <div className="medication-dose-control">
                <div className="medication-dose-value">
                  <FileText size={18} />

                  <input
                    type="text"
                    value={doseValue}
                    onChange={(event) =>
                      setDoseValue(
                        event.target.value
                      )
                    }
                    placeholder="50000"
                    required
                  />
                </div>

                <div className="medication-select-wrap medication-unit-select">
                  <select
                    value={doseUnit}
                    onChange={(event) =>
                      setDoseUnit(
                        event.target.value
                      )
                    }
                    aria-label="Dose unit"
                  >
                    {DOSE_UNITS.map(
                      (unit) => (
                        <option
                          key={unit}
                          value={unit}
                        >
                          {unit}
                        </option>
                      )
                    )}
                  </select>

                  <ChevronDown size={17} />
                </div>
              </div>
            </label>

            {/* INSTRUCTIONS */}

            <label className="medication-field">
              <span>Instructions</span>

              <div className="medication-select-wrap">
                <FileText size={18} />

                <select
                  value={instructions}
                  onChange={(event) =>
                    setInstructions(
                      event.target.value
                    )
                  }
                  required
                >
                  <option
                    value=""
                    disabled
                  >
                    Select instructions
                  </option>

                  {INSTRUCTION_OPTIONS.map(
                    (instruction) => (
                      <option
                        key={instruction}
                        value={instruction}
                      >
                        {instruction}
                      </option>
                    )
                  )}
                </select>

                <ChevronDown size={17} />
              </div>

              {instructions === "Other" && (
                <div className="medication-custom-instructions">
                  <FileText size={18} />

                  <input
                    type="text"
                    value={
                      customInstructions
                    }
                    onChange={(event) =>
                      setCustomInstructions(
                        event.target.value
                      )
                    }
                    placeholder="Enter custom instructions"
                    required
                  />
                </div>
              )}
            </label>

            {/* REMAINING DAYS */}

            <label className="medication-field">
              <span>Remaining days</span>

              <div className="medication-input-wrap">
                <CalendarDays size={18} />

                <input
                  type="number"
                  min="0"
                  value={remainingDays}
                  onChange={(event) =>
                    setRemainingDays(
                      event.target.value
                    )
                  }
                  required
                />
              </div>
            </label>
          </div>

          <div className="medication-form-actions">
            <button
              type="button"
              className="medication-btn medication-btn-light"
              onClick={resetForm}
              disabled={saving}
            >
              <ArrowLeft size={17} />
              Cancel
            </button>

            <button
              type="submit"
              className="medication-btn medication-btn-primary"
              disabled={saving}
            >
              <Save size={17} />

              {saving
                ? "Saving..."
                : editingMedication
                  ? "Save changes"
                  : "Add medication"}
            </button>
          </div>
        </form>
      )}

      {/* MEDICATION DETAILS */}

      {selectedMedication &&
        !showForm && (
          <div className="appointment-form medication-details">
            <div className="medication-details-header">
              <div className="medication-title-area">
                <div className="medication-main-icon">
                  <Pill size={27} />
                </div>

                <div>
                  <p className="medication-eyebrow">
                    Medication
                  </p>

                  <h3>
                    {
                      selectedMedication.name
                    }
                  </h3>
                </div>
              </div>

              <span
                className={`medication-status ${
                  selectedMedication.active
                    ? "medication-status-active"
                    : "medication-status-cancelled"
                }`}
              >
                {selectedMedication.active
                  ? "Active"
                  : "Cancelled"}
              </span>
            </div>

            <div className="medication-info-grid">
              <div className="medication-info-card">
                <div className="medication-info-icon">
                  <Pill size={20} />
                </div>

                <div>
                  <span>
                    Dose / Strength
                  </span>

                  <strong>
                    {
                      selectedMedication.dose
                    }
                  </strong>
                </div>
              </div>

              <div className="medication-info-card">
                <div className="medication-info-icon">
                  <FileText size={20} />
                </div>

                <div>
                  <span>
                    Instructions
                  </span>

                  <strong>
                    {
                      selectedMedication.instructions
                    }
                  </strong>
                </div>
              </div>

              <div className="medication-info-card">
                <div className="medication-info-icon">
                  <CalendarDays
                    size={20}
                  />
                </div>

                <div>
                  <span>Remaining</span>

                  <strong>
                    {
                      selectedMedication.remainingDays
                    }{" "}
                    days
                  </strong>
                </div>
              </div>

              <div className="medication-info-card">
                <div className="medication-info-icon">
                  <CheckCircle2
                    size={20}
                  />
                </div>

                <div>
                  <span>Status</span>

                  <strong>
                    {selectedMedication.active
                      ? "Active"
                      : "Cancelled"}
                  </strong>
                </div>
              </div>

              <div className="medication-info-card medication-info-card-wide">
                <div className="medication-info-icon">
                  <Clock3 size={20} />
                </div>

                <div>
                  <span>Last taken</span>

                  <strong>
                    {selectedMedication.lastTakenAt
                      ? new Date(
                          selectedMedication.lastTakenAt
                        ).toLocaleString()
                      : "Not recorded yet"}
                  </strong>
                </div>
              </div>
            </div>

            <div className="medication-details-actions">
              <button
                type="button"
                className="medication-btn medication-btn-light"
                onClick={() =>
                  setSelectedMedication(
                    null
                  )
                }
              >
                <ArrowLeft size={17} />
                Back
              </button>

              {selectedMedication.active ? (
                <>
                  <button
                    type="button"
                    className="medication-btn medication-btn-light"
                    onClick={() =>
                      handleEditMedication(
                        selectedMedication
                      )
                    }
                  >
                    <Edit3 size={17} />
                    Edit
                  </button>

                  <button
                    type="button"
                    className="medication-btn medication-btn-primary"
                    onClick={() =>
                      handleMarkTaken(
                        selectedMedication
                      )
                    }
                  >
                    <CheckCircle2
                      size={17}
                    />
                    Mark taken
                  </button>

                  <button
                    type="button"
                    className="medication-btn medication-btn-soft"
                    onClick={() =>
                      handleCancelMedication(
                        selectedMedication
                      )
                    }
                  >
                    <XCircle size={17} />
                    Cancel medication
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="medication-btn medication-btn-soft"
                  onClick={() =>
                    handleDeleteMedication(
                      selectedMedication
                    )
                  }
                >
                  <Trash2 size={17} />
                  Delete permanently
                </button>
              )}
            </div>
          </div>
        )}

      {/* MEDICATION LIST */}

      {!selectedMedication &&
        !showForm && (
          <>
            <div className="item-list">
              {medications.length ? (
                medications.map(
                  (medication) => (
                    <MedicationCard
                      key={
                        medication._id
                      }
                      medication={
                        medication
                      }
                      onSelect={
                        handleSelectMedication
                      }
                    />
                  )
                )
              ) : (
                <div className="empty">
                  No medications yet.
                </div>
              )}
            </div>

            <button
              type="button"
              className="medication-add-button"
              onClick={
                handleAddMedication
              }
            >
              Add medication
            </button>
          </>
        )}
    </>
  );
}

export default Medications;