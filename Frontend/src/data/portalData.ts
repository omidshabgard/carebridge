import {
  CalendarDays,
  CircleDollarSign,
  ClipboardList,
  FileHeart,
  FileText,
  Home,
  MessageCircle,
  Pill,
  Settings,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

import type { PortalItem, Section } from "../types";

export const nav: {
  name: Section;
  icon: typeof Home;
  badge?: number;
  color: string;
}[] = [
  {
    name: "Overview",
    icon: Home,
    color: "mint",
  },
  {
    name: "Appointments",
    icon: CalendarDays,
    color: "blue",
  },
  {
    name: "Messages",
    icon: MessageCircle,
    badge: 2,
    color: "coral",
  },
  {
    name: "Medications",
    icon: Pill,
    color: "violet",
  },
  {
    name: "Test results",
    icon: ClipboardList,
    badge: 1,
    color: "amber",
  },
  {
    name: "Health records",
    icon: FileHeart,
    color: "rose",
  },
  {
    name: "Billing",
    icon: CircleDollarSign,
    color: "green",
  },
  {
    name: "Insurance",
    icon: ShieldCheck,
    color: "cyan",
  },
  {
    name: "Care team",
    icon: Stethoscope,
    color: "indigo",
  },
  {
    name: "Documents",
    icon: FileText,
    color: "orange",
  },
  {
    name: "Settings",
    icon: Settings,
    color: "slate",
  },
];

export const content: Record<
  Exclude<Section, "Overview">,
  {
    intro: string;
    items: PortalItem[];
  }
> = {
  Appointments: {
    intro: "Schedule, reschedule, and prepare for care.",
    items: [
      {
        title: "Annual wellness visit",
        detail: "Dr. Maya Chen • Primary Care",
        meta: "September 12 • 10:30 AM",
        status: "Confirmed",
      },
      {
        title: "Cardiology follow-up",
        detail: "Dr. James Park • Video visit",
        meta: "September 18 • 2:00 PM",
        status: "Confirmed",
      },
    ],
  },

  Messages: {
    intro: "Secure conversations with your care team.",
    items: [
      {
        title: "Dr. Maya Chen",
        detail:
          "Your lab results look good. Let’s review them at your visit.",
        meta: "Today • 9:15 AM",
        status: "Unread",
      },
      {
        title: "Care coordination",
        detail: "Your cardiology referral has been approved.",
        meta: "Yesterday",
      },
    ],
  },

  Medications: {
    intro: "Track doses, instructions, and refills.",
    items: [
      {
        title: "Lisinopril • 10 mg",
        detail: "Take once daily in the morning",
        meta: "5 days remaining",
        status: "Refill soon",
      },
      {
        title: "Vitamin D3 • 1,000 IU",
        detail: "Take once daily with food",
        meta: "Next dose • 6:00 PM",
      },
    ],
  },

  "Test results": {
    intro: "Review results with plain-language status labels.",
    items: [
      {
        title: "Complete blood count",
        detail: "All values within expected range",
        meta: "August 28",
        status: "New",
      },
      {
        title: "Lipid panel",
        detail: "One value needs discussion at your next visit",
        meta: "August 28",
        status: "Follow up",
      },
    ],
  },

  "Health records": {
    intro: "Your medical history in one organized view.",
    items: [
      {
        title: "Annual visit summary",
        detail: "Primary care • Dr. Maya Chen",
        meta: "March 14 • PDF available",
      },
      {
        title: "Immunization record",
        detail: "8 verified immunizations",
        meta: "Updated July 6",
      },
    ],
  },

  Billing: {
    intro: "Understand balances, statements, and payments.",
    items: [
      {
        title: "Current balance",
        detail: "Primary care visit",
        meta: "Due September 30",
        status: "$42.00",
      },
      {
        title: "August statement",
        detail: "Insurance processed",
        meta: "Statement #CB-21984",
      },
    ],
  },

  Insurance: {
    intro: "Coverage details and recent claims.",
    items: [
      {
        title: "NorthStar Health PPO",
        detail: "Member ID • NSH-48021",
        meta: "Coverage active",
        status: "Active",
      },
      {
        title: "Cardiology claim",
        detail: "Amount billed • $260.00",
        meta: "Processed August 30",
      },
    ],
  },

  "Care team": {
    intro: "Your doctors, specialists, and care coordinators.",
    items: [
      {
        title: "Dr. Maya Chen",
        detail: "Primary care physician",
        meta: "Next visit • September 12",
      },
      {
        title: "Dr. James Park",
        detail: "Cardiologist",
        meta: "Next visit • September 18",
      },
    ],
  },

  Documents: {
    intro: "Forms, letters, and downloadable records.",
    items: [
      {
        title: "Pre-visit questionnaire",
        detail: "Complete before your annual visit",
        meta: "Due September 11",
        status: "Action needed",
      },
      {
        title: "Work clearance letter",
        detail: "Signed by Dr. Maya Chen",
        meta: "PDF • August 11",
      },
    ],
  },

  Settings: {
    intro: "Manage contact details, notifications, and access.",
    items: [
      {
        title: "Profile and contact",
        detail: "Email, phone, address, emergency contact",
        meta: "Last reviewed August 2",
      },
      {
        title: "Security and privacy",
        detail: "Password, sign-in activity, data access",
        meta: "Two-step verification available",
      },
    ],
  },
};