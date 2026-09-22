export type HealthRecordType =
  | "Visit summary"
  | "Procedure"
  | "Immunization"
  | "Diagnosis"
  | "Hospital"
  | "Other";

export type HealthRecord = {
  _id: string;

  title: string;
  type: HealthRecordType;

  providerName: string;
  facility?: string;

  recordDate: string;

  summary: string;

  diagnosis?: string;
  notes?: string;

  documentAvailable: boolean;

  createdAt?: string;
  updatedAt?: string;
};

export async function getHealthRecords(): Promise<
  HealthRecord[]
> {
  const token = localStorage.getItem(
    "carebridge_token"
  );

  if (!token) {
    throw new Error(
      "Authentication is required."
    );
  }

  const response = await fetch(
    "/api/health-records",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Unable to load health records."
    );
  }

  return response.json();
}