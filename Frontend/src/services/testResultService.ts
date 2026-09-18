export type TestResultStatus =
  | "normal"
  | "follow-up"
  | "abnormal"
  | "pending";

export type TestResultCategory =
  | "blood-work"
  | "imaging"
  | "urine"
  | "other";

export type TrendPoint = {
  date: string;
  value: number;
};

export type TestMeasurement = {
  id: string;
  name: string;
  shortName?: string;
  value: number;
  unit: string;

  referenceRange: {
    min?: number;
    max?: number;
    label: string;
  };

  status: TestResultStatus;

  history?: TrendPoint[];
};

export type TestResult = {
  id: string;
  name: string;
  category: TestResultCategory;
  date: string;

  facility: string;
  provider: string;

  status: TestResultStatus;

  summary: string;

  measurements: TestMeasurement[];

  notes?: string;
};

export type TestResultSummary = {
  total: number;
  normal: number;
  followUp: number;
  abnormal: number;
  pending: number;
};

/*
  ---------------------------------------------------------
  FRONTEND MOCK DATA
  ---------------------------------------------------------

  We are intentionally using mock data while building the
  Test Results frontend.

  Later this file can call the CareBridge backend without
  requiring the UI components to be redesigned.
*/

const mockTestResults: TestResult[] = [
  {
    id: "vitamin-d-2026-08",
    name: "Vitamin D, 25-Hydroxy",
    category: "blood-work",
    date: "2026-08-28",

    facility: "Albany Medical Center",
    provider: "Dr. Sarah Johnson",

    status: "normal",

    summary:
      "Your vitamin D level is within the reference range.",

    measurements: [
      {
        id: "vitamin-d",
        name: "Vitamin D, 25-Hydroxy",
        shortName: "Vitamin D",

        value: 46,
        unit: "ng/mL",

        referenceRange: {
          min: 30,
          max: 100,
          label: "30 – 100 ng/mL",
        },

        status: "normal",

        history: [
          {
            date: "2026-01-15",
            value: 18,
          },
          {
            date: "2026-03-12",
            value: 26,
          },
          {
            date: "2026-05-18",
            value: 34,
          },
          {
            date: "2026-07-10",
            value: 42,
          },
          {
            date: "2026-08-28",
            value: 46,
          },
        ],
      },
    ],

    notes:
      "Continue your current vitamin D plan and discuss any questions with your care team.",
  },

  {
    id: "cbc-2026-08",
    name: "Complete Blood Count (CBC)",
    category: "blood-work",
    date: "2026-08-12",

    facility: "Albany Medical Center",
    provider: "Dr. Maya Chen",

    status: "follow-up",

    summary:
      "Most values are within range. One result may need follow-up.",

    measurements: [
      {
        id: "wbc",
        name: "White Blood Cells",
        shortName: "WBC",

        value: 6.2,
        unit: "K/µL",

        referenceRange: {
          min: 4,
          max: 11,
          label: "4.0 – 11.0 K/µL",
        },

        status: "normal",

        history: [
          {
            date: "2025-10-10",
            value: 5.8,
          },
          {
            date: "2026-02-14",
            value: 6,
          },
          {
            date: "2026-08-12",
            value: 6.2,
          },
        ],
      },

      {
        id: "rbc",
        name: "Red Blood Cells",
        shortName: "RBC",

        value: 4.8,
        unit: "M/µL",

        referenceRange: {
          min: 4.5,
          max: 5.9,
          label: "4.5 – 5.9 M/µL",
        },

        status: "normal",
      },

      {
        id: "hemoglobin",
        name: "Hemoglobin",

        value: 14.1,
        unit: "g/dL",

        referenceRange: {
          min: 13.5,
          max: 17.5,
          label: "13.5 – 17.5 g/dL",
        },

        status: "normal",

        history: [
          {
            date: "2025-10-10",
            value: 13.7,
          },
          {
            date: "2026-02-14",
            value: 13.9,
          },
          {
            date: "2026-08-12",
            value: 14.1,
          },
        ],
      },

      {
        id: "hematocrit",
        name: "Hematocrit",

        value: 42.3,
        unit: "%",

        referenceRange: {
          min: 41,
          max: 53,
          label: "41 – 53%",
        },

        status: "normal",
      },

      {
        id: "platelets",
        name: "Platelets",

        value: 250,
        unit: "K/µL",

        referenceRange: {
          min: 150,
          max: 450,
          label: "150 – 450 K/µL",
        },

        status: "normal",
      },

      {
        id: "mcv",
        name: "Mean Corpuscular Volume",
        shortName: "MCV",

        value: 78,
        unit: "fL",

        referenceRange: {
          min: 80,
          max: 100,
          label: "80 – 100 fL",
        },

        status: "follow-up",

        history: [
          {
            date: "2025-10-10",
            value: 84,
          },
          {
            date: "2026-02-14",
            value: 81,
          },
          {
            date: "2026-08-12",
            value: 78,
          },
        ],
      },
    ],

    notes:
      "Your care team may want to review the MCV result with you.",
  },

  {
    id: "lipid-2026-07",
    name: "Lipid Panel",
    category: "blood-work",
    date: "2026-07-15",

    facility: "Albany Medical Center",
    provider: "Dr. Maya Chen",

    status: "normal",

    summary:
      "Your lipid panel results are currently within the listed reference ranges.",

    measurements: [
      {
        id: "total-cholesterol",
        name: "Total Cholesterol",

        value: 176,
        unit: "mg/dL",

        referenceRange: {
          max: 200,
          label: "Below 200 mg/dL",
        },

        status: "normal",

        history: [
          {
            date: "2025-01-20",
            value: 205,
          },
          {
            date: "2025-08-16",
            value: 192,
          },
          {
            date: "2026-01-22",
            value: 184,
          },
          {
            date: "2026-07-15",
            value: 176,
          },
        ],
      },

      {
        id: "ldl",
        name: "LDL Cholesterol",
        shortName: "LDL",

        value: 98,
        unit: "mg/dL",

        referenceRange: {
          max: 100,
          label: "Below 100 mg/dL",
        },

        status: "normal",

        history: [
          {
            date: "2025-01-20",
            value: 126,
          },
          {
            date: "2025-08-16",
            value: 114,
          },
          {
            date: "2026-01-22",
            value: 106,
          },
          {
            date: "2026-07-15",
            value: 98,
          },
        ],
      },

      {
        id: "hdl",
        name: "HDL Cholesterol",
        shortName: "HDL",

        value: 54,
        unit: "mg/dL",

        referenceRange: {
          min: 40,
          label: "40 mg/dL or higher",
        },

        status: "normal",
      },

      {
        id: "triglycerides",
        name: "Triglycerides",

        value: 118,
        unit: "mg/dL",

        referenceRange: {
          max: 150,
          label: "Below 150 mg/dL",
        },

        status: "normal",
      },
    ],
  },

  {
    id: "a1c-2026-05",
    name: "Hemoglobin A1c",
    category: "blood-work",
    date: "2026-05-10",

    facility: "Albany Medical Center",
    provider: "Dr. Sarah Johnson",

    status: "abnormal",

    summary:
      "This result is outside the listed reference range and should be reviewed with your care team.",

    measurements: [
      {
        id: "a1c",
        name: "Hemoglobin A1c",
        shortName: "A1c",

        value: 6.7,
        unit: "%",

        referenceRange: {
          max: 5.6,
          label: "Below 5.7%",
        },

        status: "abnormal",

        history: [
          {
            date: "2025-05-04",
            value: 5.8,
          },
          {
            date: "2025-09-08",
            value: 6.1,
          },
          {
            date: "2026-01-12",
            value: 6.4,
          },
          {
            date: "2026-05-10",
            value: 6.7,
          },
        ],
      },
    ],

    notes:
      "Please discuss this result with your care team.",
  },

  {
    id: "tsh-2026-03",
    name: "Thyroid Panel (TSH)",
    category: "blood-work",
    date: "2026-03-22",

    facility: "Albany Medical Center",
    provider: "Dr. Maya Chen",

    status: "normal",

    summary:
      "Your thyroid result is within the listed reference range.",

    measurements: [
      {
        id: "tsh",
        name: "Thyroid Stimulating Hormone",
        shortName: "TSH",

        value: 2.1,
        unit: "mIU/L",

        referenceRange: {
          min: 0.4,
          max: 4,
          label: "0.4 – 4.0 mIU/L",
        },

        status: "normal",

        history: [
          {
            date: "2025-03-18",
            value: 2.8,
          },
          {
            date: "2025-09-20",
            value: 2.4,
          },
          {
            date: "2026-03-22",
            value: 2.1,
          },
        ],
      },
    ],
  },

  {
    id: "cmp-2026-01",
    name: "Comprehensive Metabolic Panel",
    category: "blood-work",
    date: "2026-01-28",

    facility: "Albany Medical Center",
    provider: "Dr. Maya Chen",

    status: "normal",

    summary:
      "The measurements shown are within their listed reference ranges.",

    measurements: [
      {
        id: "glucose",
        name: "Glucose",

        value: 91,
        unit: "mg/dL",

        referenceRange: {
          min: 70,
          max: 99,
          label: "70 – 99 mg/dL",
        },

        status: "normal",

        history: [
          {
            date: "2025-01-25",
            value: 96,
          },
          {
            date: "2025-07-19",
            value: 94,
          },
          {
            date: "2026-01-28",
            value: 91,
          },
        ],
      },

      {
        id: "calcium",
        name: "Calcium",

        value: 9.4,
        unit: "mg/dL",

        referenceRange: {
          min: 8.6,
          max: 10.2,
          label: "8.6 – 10.2 mg/dL",
        },

        status: "normal",
      },

      {
        id: "sodium",
        name: "Sodium",

        value: 140,
        unit: "mmol/L",

        referenceRange: {
          min: 135,
          max: 145,
          label: "135 – 145 mmol/L",
        },

        status: "normal",
      },
    ],
  },

  {
    id: "chest-xray-2025-12",
    name: "Chest X-ray",
    category: "imaging",
    date: "2025-12-08",

    facility: "Albany Medical Center",
    provider: "Dr. Sarah Johnson",

    status: "normal",

    summary:
      "No acute abnormality is listed in this mock imaging result.",

    measurements: [],

    notes:
      "Imaging results will later use a report-style details view rather than laboratory measurement ranges.",
  },

  {
    id: "urinalysis-2025-11",
    name: "Urinalysis",
    category: "urine",
    date: "2025-11-14",

    facility: "Albany Medical Center",
    provider: "Dr. Maya Chen",

    status: "normal",

    summary:
      "The measurements shown are within their listed reference ranges.",

    measurements: [
      {
        id: "urine-ph",
        name: "Urine pH",

        value: 6,
        unit: "",

        referenceRange: {
          min: 4.5,
          max: 8,
          label: "4.5 – 8.0",
        },

        status: "normal",
      },
    ],
  },

  {
    id: "pending-lab-2026-09",
    name: "Iron Studies",
    category: "blood-work",
    date: "2026-09-16",

    facility: "Albany Medical Center",
    provider: "Dr. Maya Chen",

    status: "pending",

    summary:
      "This result is still being processed.",

    measurements: [],
  },
];

/*
  Simulate a small API delay so the frontend behaves more
  like it will once we connect the real backend.
*/

function wait(ms = 180) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export async function getTestResults(): Promise<TestResult[]> {
  await wait();

  return [...mockTestResults].sort(
    (a, b) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime()
  );
}

export async function getTestResultById(
  id: string
): Promise<TestResult | null> {
  await wait();

  return (
    mockTestResults.find(
      (result) => result.id === id
    ) ?? null
  );
}

export async function getTestResultSummary(): Promise<TestResultSummary> {
  await wait();

  return mockTestResults.reduce<TestResultSummary>(
    (summary, result) => {
      summary.total += 1;

      if (result.status === "normal") {
        summary.normal += 1;
      }

      if (result.status === "follow-up") {
        summary.followUp += 1;
      }

      if (result.status === "abnormal") {
        summary.abnormal += 1;
      }

      if (result.status === "pending") {
        summary.pending += 1;
      }

      return summary;
    },
    {
      total: 0,
      normal: 0,
      followUp: 0,
      abnormal: 0,
      pending: 0,
    }
  );
}