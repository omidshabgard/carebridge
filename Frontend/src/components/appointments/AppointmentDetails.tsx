import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Stethoscope,
  Trash2,
  UserRound,
} from "lucide-react";

import {
  cancelAppointment,
  deleteAppointment,
  type Appointment,
} from "../../services/appointmentService";

type Props = {
  appointment: Appointment;
  onBack: () => void;
  onCancelled: (appointment: Appointment) => void;
  onDeleted: (appointmentId: string) => void;
};

export default function AppointmentDetails({
  appointment,
  onBack,
  onCancelled,
  onDeleted,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const date = new Date(appointment.startsAt);

  const canCancel =
    appointment.status !== "cancelled" &&
    appointment.status !== "completed";

  const canDelete = appointment.status === "cancelled";

  const formattedStatus =
    appointment.status.charAt(0).toUpperCase() +
    appointment.status.slice(1);

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

  async function handleDelete() {
    const confirmed = window.confirm(
      "Permanently delete this cancelled appointment? This cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setBusy(true);
      setError("");

      await deleteAppointment(appointment._id);

      onDeleted(appointment._id);
    } catch (error) {
      console.error(error);
      setError("Unable to delete appointment.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="appointment-details">
      <div className="appointment-details-header">
        <div className="appointment-title-area">
          <span className="appointment-main-icon">
            <CalendarDays />
          </span>

          <div>
            <p className="appointment-eyebrow">
              APPOINTMENT DETAILS
            </p>

            <h2>{appointment.reason}</h2>
          </div>
        </div>

        <span
          className={`appointment-status appointment-status-${appointment.status}`}
        >
          {formattedStatus}
        </span>
      </div>

      <div className="appointment-info-grid">
        <article className="appointment-info-card">
          <span className="appointment-info-icon">
            <UserRound />
          </span>

          <div>
            <span>Provider</span>
            <strong>{appointment.providerName}</strong>
          </div>
        </article>

        <article className="appointment-info-card">
          <span className="appointment-info-icon">
            <Stethoscope />
          </span>

          <div>
            <span>Specialty</span>
            <strong>{appointment.specialty}</strong>
          </div>
        </article>

        <article className="appointment-info-card">
          <span className="appointment-info-icon">
            <CalendarDays />
          </span>

          <div>
            <span>Date</span>
            <strong>
              {date.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </strong>
          </div>
        </article>

        <article className="appointment-info-card">
          <span className="appointment-info-icon">
            <Clock />
          </span>

          <div>
            <span>Time</span>
            <strong>
              {date.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </strong>
          </div>
        </article>

        <article className="appointment-info-card">
          <span className="appointment-info-icon">
            <MapPin />
          </span>

          <div>
            <span>Visit type</span>
            <strong>
              {appointment.visitType === "video"
                ? "Video visit"
                : "In person"}
            </strong>
          </div>
        </article>

        <article className="appointment-info-card">
          <span className="appointment-info-icon">
            <CalendarDays />
          </span>

          <div>
            <span>Status</span>
            <strong>{formattedStatus}</strong>
          </div>
        </article>

        <article className="appointment-info-card appointment-info-card-wide">
          <span className="appointment-info-icon">
            <Stethoscope />
          </span>

          <div>
            <span>Reason for visit</span>
            <strong>{appointment.reason}</strong>
          </div>
        </article>
      </div>

      {error && (
        <p className="appointment-details-error">{error}</p>
      )}

      <div className="appointment-details-actions">
        <button
          type="button"
          className="appointment-btn appointment-btn-light"
          onClick={onBack}
          disabled={busy}
        >
          <ArrowLeft size={17} />
          Back to appointments
        </button>

        {canCancel && (
          <button
            type="button"
            className="appointment-btn appointment-btn-soft"
            onClick={handleCancel}
            disabled={busy}
          >
            {busy ? "Cancelling..." : "Cancel appointment"}
          </button>
        )}

        {canDelete && (
          <button
            type="button"
            className="appointment-btn appointment-btn-danger"
            onClick={handleDelete}
            disabled={busy}
          >
            <Trash2 size={17} />
            {busy ? "Deleting..." : "Delete appointment"}
          </button>
        )}
      </div>
    </section>
  );
}