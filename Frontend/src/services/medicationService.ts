const API_URL =
  import.meta.env.VITE_API_URL ??
  "https://carebridge-api-157552527011.us-east1.run.app/api";

export type Medication = {
  _id: string;
  name: string;
  dose: string;
  instructions: string;
  remainingDays: number;
  active: boolean;
  lastTakenAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateMedicationInput = {
  name: string;
  dose: string;
  instructions: string;
  remainingDays?: number;
};

export type UpdateMedicationInput = {
  name: string;
  dose: string;
  instructions: string;
  remainingDays: number;
};

function getToken() {
  return localStorage.getItem("carebridge_token");
}

function getHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getMedications(): Promise<Medication[]> {
  const response = await fetch(`${API_URL}/medications`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to load medications");
  }

  return response.json();
}

export async function createMedication(
  input: CreateMedicationInput
): Promise<Medication> {
  const response = await fetch(`${API_URL}/medications`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Failed to create medication");
  }

  return response.json();
}

export async function updateMedication(
  id: string,
  input: UpdateMedicationInput
): Promise<Medication> {
  const response = await fetch(`${API_URL}/medications/${id}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Failed to update medication");
  }

  return response.json();
}

export async function cancelMedication(
  id: string
): Promise<Medication> {
  const response = await fetch(
    `${API_URL}/medications/${id}/cancel`,
    {
      method: "PATCH",
      headers: getHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to cancel medication");
  }

  return response.json();
}

export async function markMedicationTaken(
  id: string
): Promise<Medication> {
  const response = await fetch(
    `${API_URL}/medications/${id}/taken`,
    {
      method: "PATCH",
      headers: getHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to mark medication as taken");
  }

  return response.json();
}

export async function deleteMedication(
  id: string
): Promise<void> {
  const response = await fetch(`${API_URL}/medications/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete medication");
  }
}