import { FormEvent, useEffect, useState } from "react";
import MedicationCard from "./MedicationCard";
import {
  cancelMedication,
  createMedication,
  getMedications,
  markMedicationTaken,
  updateMedication,
  type Medication,
} from "../../services/medicationService";

type MedicationsProps = {
  show: (message: string) => void;
};

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
  const [dose, setDose] = useState("");
  const [instructions, setInstructions] = useState("");
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
    setDose("");
    setInstructions("");
    setRemainingDays("30");
    setEditingMedication(null);
    setShowForm(false);
  }

  function handleAddMedication() {
    setSelectedMedication(null);
    setEditingMedication(null);

    setName("");
    setDose("");
    setInstructions("");
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
    setDose(medication.dose);
    setInstructions(medication.instructions);
    setRemainingDays(String(medication.remainingDays));

    setShowForm(true);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (editingMedication) {
        const updatedMedication = await updateMedication(
          editingMedication._id,
          {
            name: name.trim(),
            dose: dose.trim(),
            instructions: instructions.trim(),
            remainingDays: Number(remainingDays),
          }
        );

        setMedications((current) =>
          current.map((item) =>
            item._id === updatedMedication._id
              ? updatedMedication
              : item
          )
        );

        setSelectedMedication(updatedMedication);

        show("Medication updated successfully.");
      } else {
        const medication = await createMedication({
          name: name.trim(),
          dose: dose.trim(),
          instructions: instructions.trim(),
          remainingDays: Number(remainingDays),
        });

        setMedications((current) => [
          medication,
          ...current,
        ]);

        show("Medication added successfully.");
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

  async function handleMarkTaken(medication: Medication) {
    try {
      setError("");

      const updatedMedication =
        await markMedicationTaken(medication._id);

      setMedications((current) =>
        current.map((item) =>
          item._id === updatedMedication._id
            ? updatedMedication
            : item
        )
      );

      setSelectedMedication(updatedMedication);

      show(`${medication.name} marked as taken.`);
    } catch (error) {
      console.error(error);
      setError("Unable to mark medication as taken.");
    }
  }

  async function handleCancelMedication(
    medication: Medication
  ) {
    try {
      setError("");

      const updatedMedication =
        await cancelMedication(medication._id);

      setMedications((current) =>
        current.map((item) =>
          item._id === updatedMedication._id
            ? updatedMedication
            : item
        )
      );

      setSelectedMedication(updatedMedication);

      show(`${medication.name} cancelled.`);
    } catch (error) {
      console.error(error);
      setError("Unable to cancel medication.");
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

      {showForm && (
        <form
          className="appointment-form"
          onSubmit={handleSubmit}
        >
          <div className="form-grid">
            <label>
              Medication name
              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Lisinopril"
                required
              />
            </label>

            <label>
              Dose
              <input
                type="text"
                value={dose}
                onChange={(event) =>
                  setDose(event.target.value)
                }
                placeholder="10 mg"
                required
              />
            </label>

            <label>
              Instructions
              <input
                type="text"
                value={instructions}
                onChange={(event) =>
                  setInstructions(event.target.value)
                }
                placeholder="Take once daily in the morning"
                required
              />
            </label>

            <label>
              Remaining days
              <input
                type="number"
                min="0"
                value={remainingDays}
                onChange={(event) =>
                  setRemainingDays(event.target.value)
                }
                required
              />
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="outline"
              onClick={resetForm}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="action"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingMedication
                  ? "Save changes"
                  : "Add medication"}
            </button>
          </div>
        </form>
      )}

      {selectedMedication && !showForm && (
        <div className="appointment-form">
          <h3>{selectedMedication.name}</h3>

          <p>
            <strong>Dose:</strong>{" "}
            {selectedMedication.dose}
          </p>

          <p>
            <strong>Instructions:</strong>{" "}
            {selectedMedication.instructions}
          </p>

          <p>
            <strong>Remaining:</strong>{" "}
            {selectedMedication.remainingDays} days
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {selectedMedication.active
              ? "Active"
              : "Cancelled"}
          </p>

          {selectedMedication.lastTakenAt && (
            <p>
              <strong>Last taken:</strong>{" "}
              {new Date(
                selectedMedication.lastTakenAt
              ).toLocaleString()}
            </p>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="outline"
              onClick={() =>
                setSelectedMedication(null)
              }
            >
              Back
            </button>

            {selectedMedication.active && (
              <>
                <button
                  type="button"
                  className="outline"
                  onClick={() =>
                    handleEditMedication(
                      selectedMedication
                    )
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="outline"
                  onClick={() =>
                    handleMarkTaken(
                      selectedMedication
                    )
                  }
                >
                  Mark taken
                </button>

                <button
                  type="button"
                  className="outline"
                  onClick={() =>
                    handleCancelMedication(
                      selectedMedication
                    )
                  }
                >
                  Cancel medication
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {!selectedMedication && !showForm && (
        <>
          <div className="item-list">
            {medications.length ? (
              medications.map((medication) => (
                <MedicationCard
                  key={medication._id}
                  medication={medication}
                  onSelect={handleSelectMedication}
                />
              ))
            ) : (
              <div className="empty">
                No medications yet.
              </div>
            )}
          </div>

          <button
            className="action"
            onClick={handleAddMedication}
          >
            Add medication
          </button>
        </>
      )}
    </>
  );
}

export default Medications;