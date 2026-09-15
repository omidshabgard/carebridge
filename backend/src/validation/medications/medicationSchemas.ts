import { z } from "zod";

export const createMedicationSchema = z.object({
  name: z.string().trim().min(1).max(120),
  dose: z.string().trim().min(1).max(120),
  instructions: z.string().trim().min(1).max(500),
  remainingDays: z.number().int().min(0).optional(),
});

export const updateMedicationSchema = z.object({
  name: z.string().trim().min(1).max(120),
  dose: z.string().trim().min(1).max(120),
  instructions: z.string().trim().min(1).max(500),
  remainingDays: z.number().int().min(0),
});