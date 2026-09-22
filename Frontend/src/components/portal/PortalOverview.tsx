import { useEffect, useState } from "react";
import {
  Activity,
  CalendarDays,
  ChevronRight,
  FileHeart,
  FlaskConical,
  HeartPulse,
  Hospital,
  Pill,
  Stethoscope,
  UserRound,
} from "lucide-react";

import type { Appointment } from "../../services/appointmentService";
import type { Medication } from "../../services/medicationService";
import {
  getHealthRecords,
  type HealthRecord,
} from "../../services/healthRecordService";
import {
  getTestResults,
  type TestResult,
} from "../../services/testResultService";
import type { Section } from "../../types";
import Metric from "./Metric";

type PortalOverviewProps = {
  appointments: Appointment[];
  medications: Medication[];
  onSectionChange: (section: Section) => void;
  onOpenTestResults: () => void;
  show: (message: string) => void;
};

function formatTestResultDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTestResultStatus(status: TestResult["status"]) {
  if (status === "follow-up") {
    return "Follow-up";
  }

  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatHealthRecordDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function PortalOverview({
  appointments,
  medications,
  onSectionChange,
  onOpenTestResults,
  show,
}: PortalOverviewProps) {
  const [latestTestResult, setLatestTestResult] =
    useState<TestResult | null>(null);

  const [latestHealthRecord, setLatestHealthRecord] =
    useState<HealthRecord | null>(null);

  const [healthRecordCount, setHealthRecordCount] =
    useState(0);

  useEffect(() => {
    let active = true;

    async function loadLatestTestResult() {
      try {
        const results = await getTestResults();

        if (!active) {
          return;
        }

        const latest = [...results].sort(
          (a, b) =>
            new Date(b.date).getTime() -
            new Date(a.date).getTime(),
        )[0];

        setLatestTestResult(latest ?? null);
      } catch {
        if (active) {
          setLatestTestResult(null);
        }
      }
    }

    void loadLatestTestResult();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadHealthRecords() {
      try {
        const records = await getHealthRecords();

        if (!active) {
          return;
        }

        const sorted = [...records].sort(
          (a, b) =>
            new Date(b.recordDate).getTime() -
            new Date(a.recordDate).getTime(),
        );

        setHealthRecordCount(sorted.length);
        setLatestHealthRecord(sorted[0] ?? null);
      } catch {
        if (active) {
          setHealthRecordCount(0);
          setLatestHealthRecord(null);
        }
      }
    }

    void loadHealthRecords();

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <section className="hero">
        <div>
          <span>
            <HeartPulse />
            YOUR HEALTH, CONNECTED
          </span>

          <h1>Care that knows you.</h1>

          <p>
            Manage your health and stay connected with your care team—all in
            one calm, secure place.
          </p>

          <button onClick={() => onSectionChange("Appointments")}>
            <CalendarDays />
            Schedule a visit
          </button>
        </div>
      </section>

      <section className="care-types">
        <button
          onClick={() => {
            onSectionChange("Appointments");
            show("Urgent care locations loaded.");
          }}
        >
          <span className="urgent">
            <Hospital />
          </span>

          <b>
            Urgent Care
            <small>Same-day help</small>
          </b>

          <ChevronRight />
        </button>

        <button onClick={() => onSectionChange("Appointments")}>
          <span className="primary">
            <Stethoscope />
          </span>

          <b>
            Primary Care
            <small>Everyday wellness</small>
          </b>

          <ChevronRight />
        </button>

        <button onClick={() => onSectionChange("Care team")}>
          <span className="specialty">
            <UserRound />
          </span>

          <b>
            Specialty Care
            <small>Expert treatment</small>
          </b>

          <ChevronRight />
        </button>
      </section>

      <div className="welcome">
        <div>
          <small>FRIDAY, SEPTEMBER 4</small>
          <h2>Good morning, Omid.</h2>
          <p>Here’s what’s happening with your health today.</p>
        </div>

        <button onClick={() => onSectionChange("Appointments")}>
          <CalendarDays />
          Book appointment
        </button>
      </div>

      <section className="metrics">
        <Metric
          title="BLOOD PRESSURE"
          value="118/76"
          unit="mmHg"
          tone="red"
          icon={HeartPulse}
        />

        <Metric
          title="HEART RATE"
          value="72"
          unit="bpm"
          tone="teal"
          icon={Activity}
        />

        <Metric
          title="WEIGHT"
          value="174"
          unit="lbs"
          tone="blue"
          icon={UserRound}
        />
      </section>

      <section className="overview-grid">
        <article className="card">
          <div className="card-head">
            <div>
              <small>YOUR SCHEDULE</small>
              <h3>Upcoming appointments</h3>
            </div>

            <button onClick={() => onSectionChange("Appointments")}>
              View all
              <ChevronRight />
            </button>
          </div>

          {appointments
            .filter(
              (appointment) =>
                appointment.status !== "cancelled" &&
                new Date(appointment.startsAt).getTime() >= Date.now(),
            )
            .sort(
              (a, b) =>
                new Date(a.startsAt).getTime() -
                new Date(b.startsAt).getTime(),
            )
            .slice(0, 2)
            .map((appointment) => {
              const date = new Date(appointment.startsAt);

              return (
                <div className="row" key={appointment._id}>
                  <span className="date">
                    {date.getDate()}

                    <small>
                      {date
                        .toLocaleString("en-US", { month: "short" })
                        .toUpperCase()}
                    </small>
                  </span>

                  <div>
                    <b>{appointment.reason}</b>

                    <p>
                      {appointment.providerName} • {appointment.specialty}
                    </p>

                    <small>
                      {date.toLocaleString("en-US", {
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </small>
                  </div>

                  <i>
                    {appointment.status.charAt(0).toUpperCase() +
                      appointment.status.slice(1)}
                  </i>
                </div>
              );
            })}
        </article>

        <article className="card">
          <div className="card-head">
            <div>
              <small>TODAY</small>
              <h3>Medications</h3>
            </div>

            <button onClick={() => onSectionChange("Medications")}>
              View all
              <ChevronRight />
            </button>
          </div>

          {medications
            .filter((medication) => medication.active)
            .slice(0, 2)
            .map((medication, index) => (
              <div className="row" key={medication._id}>
                <span className={index ? "med amber" : "med"}>
                  <Pill />
                </span>

                <div>
                  <b>
                    {medication.name} • {medication.dose}
                  </b>

                  <p>{medication.instructions}</p>

                  <small>{medication.remainingDays} days remaining</small>
                </div>
              </div>
            ))}
        </article>
      </section>

      {latestHealthRecord && (
        <section className="overview-health-record">
          <div className="overview-health-record__icon">
            <FileHeart />
          </div>

          <div className="overview-health-record__content">
            <small>HEALTH RECORDS</small>

            <div className="overview-health-record__info">
              <strong>{latestHealthRecord.title}</strong>

              <span>
                {formatHealthRecordDate(latestHealthRecord.recordDate)}
                {" • "}
                {latestHealthRecord.providerName}
              </span>
            </div>
          </div>

          <span className="overview-health-record__count">
            {healthRecordCount}{" "}
            {healthRecordCount === 1 ? "record" : "records"}
          </span>

          <button onClick={() => onSectionChange("Health records")}>
            View health records
            <ChevronRight />
          </button>
        </section>
      )}

      {latestTestResult && (
        <section className="overview-test-result">
          <div className="overview-test-result__icon">
            <FlaskConical />
          </div>

          <div className="overview-test-result__content">
            <small>LATEST TEST RESULT</small>

            <div className="overview-test-result__info">
              <strong>{latestTestResult.name}</strong>

              <span>
                {formatTestResultDate(latestTestResult.date)} •{" "}
                {latestTestResult.facility}
              </span>
            </div>
          </div>

          <span
            className={`overview-test-result__status overview-test-result__status--${latestTestResult.status}`}
          >
            {formatTestResultStatus(latestTestResult.status)}
          </span>

          <button onClick={onOpenTestResults}>
            View all results
            <ChevronRight />
          </button>
        </section>
      )}
    </>
  );
}