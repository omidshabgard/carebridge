import { useState } from "react";

import {
  cancelAppointment,
  type Appointment,
} from "../../services/appointmentService";

type Props = {
  appointment: Appointment;
  onBack: () => void;
  onCancelled: (appointment: Appointment) => void;
};

export default function AppointmentDetails({
  appointment,
  onBack,
  onCancelled,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const date = new Date(appointment.startsAt);

  const canCancel =
    appointment.status !== "cancelled" &&
    appointment.status !== "completed";

  async function handleCancel() {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setBusy(true);
      setError("");

      const updatedAppointment = await cancelAppointment(
        appointment._id
      );

      onCancelled(updatedAppointment);
    } catch (error) {
      console.error(error);
      setError("Unable to cancel appointment.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="appointment-details">
      <button type="button" onClick={onBack}>
        Back to appointments
      </button>

      <h2>{appointment.reason}</h2>

      <p>
        <strong>Provider:</strong> {appointment.providerName}
      </p>

      <p>
        <strong>Specialty:</strong> {appointment.specialty}
      </p>

      <p>
        <strong>Date:</strong>{" "}
        {date.toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })}
      </p>

      <p>
        <strong>Visit type:</strong>{" "}
        {appointment.visitType === "video"
          ? "Video visit"
          : "In person"}
      </p>

      <p>
        <strong>Status:</strong>{" "}
        {appointment.status.charAt(0).toUpperCase() +
          appointment.status.slice(1)}
      </p>

      <p>
        <strong>Reason for visit:</strong> {appointment.reason}
      </p>

      {error && <p>{error}</p>}

      {canCancel && (
        <button
          type="button"
          onClick={handleCancel}
          disabled={busy}
        >
          {busy ? "Cancelling..." : "Cancel appointment"}
        </button>
      )}
    </section>
  );
}