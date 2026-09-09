export type Appointment = {
  _id: string;
  providerName: string;
  specialty: string;
  startsAt: string;
  visitType: "in-person" | "video";
  status: "requested" | "confirmed" | "completed" | "cancelled";
  reason: string;
};

export type CreateAppointmentInput = {
  providerName: string;
  specialty: string;
  startsAt: string;
  visitType: "in-person" | "video";
  reason: string;
};

const API_BASE_URL = "http://localhost:3001/api";

function getToken() {
  return localStorage.getItem("carebridge_token");
}

export async function getAppointments(): Promise<Appointment[]> {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/appointments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to load appointments");
  }

  return response.json();
}

export async function createAppointment(
  input: CreateAppointmentInput
): Promise<Appointment> {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Failed to create appointment");
  }

  return response.json();
}

export async function cancelAppointment(
  appointmentId: string
): Promise<Appointment> {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/appointments/${appointmentId}/cancel`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to cancel appointment");
  }

  return response.json();
}