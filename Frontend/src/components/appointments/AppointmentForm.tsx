import { FormEvent, useState } from "react";

import {
  createAppointment,
  type Appointment,
} from "../../services/appointmentService";

type Props = {
  onCreated: (appointment: Appointment) => void;
  onCancel: () => void;
};

export default function AppointmentForm({
  onCreated,
  onCancel,
}: Props) {
  const [providerName, setProviderName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [visitType, setVisitType] = useState<"in-person" | "video">(
    "in-person"
  );
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    try {
      setBusy(true);
      setError("");

      const appointment = await createAppointment({
        providerName,
        specialty,
        startsAt,
        visitType,
        reason,
      });

      onCreated(appointment);
    } catch (error) {
      console.error(error);
      setError("Unable to book appointment.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="appointment-form" onSubmit={handleSubmit}>
      <h2>Book appointment</h2>

      <div className="appointment-form-grid">
        <div className="appointment-field">
          <label htmlFor="providerName">Provider name</label>

          <input
            id="providerName"
            value={providerName}
            onChange={(event) => setProviderName(event.target.value)}
            placeholder="Dr. Maya Chen"
            required
          />
        </div>

        <div className="appointment-field">
          <label htmlFor="specialty">Specialty</label>

          <input
            id="specialty"
            value={specialty}
            onChange={(event) => setSpecialty(event.target.value)}
            placeholder="Primary Care"
            required
          />
        </div>

        <div className="appointment-field">
          <label htmlFor="startsAt">Date and time</label>

          <input
            id="startsAt"
            type="datetime-local"
            value={startsAt}
            onChange={(event) => setStartsAt(event.target.value)}
            required
          />
        </div>

        <div className="appointment-field">
          <label htmlFor="visitType">Visit type</label>

          <select
            id="visitType"
            value={visitType}
            onChange={(event) =>
              setVisitType(
                event.target.value as "in-person" | "video"
              )
            }
          >
            <option value="in-person">In person</option>
            <option value="video">Video visit</option>
          </select>
        </div>

        <div className="appointment-field full">
          <label htmlFor="reason">Reason for visit</label>

          <textarea
            id="reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Tell us briefly why you need this appointment..."
            required
          />
        </div>
      </div>

      {error && (
        <p className="appointment-form-error">
          {error}
        </p>
      )}

      <div className="appointment-form-actions">
        <button
          className="primary"
          type="submit"
          disabled={busy}
        >
          {busy ? "Booking..." : "Book appointment"}
        </button>

        <button
          className="secondary"
          type="button"
          onClick={onCancel}
          disabled={busy}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}