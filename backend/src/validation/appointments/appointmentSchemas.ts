import { z } from "zod";

export const createAppointmentSchema = z.object({
  providerName: z.string().min(2),
  specialty: z.string().min(2),
  startsAt: z.coerce.date(),
  visitType: z.enum(["in-person", "video"]),
  reason: z.string().min(3).max(500),
});

export type CreateAppointmentInput = z.infer<
  typeof createAppointmentSchema
>;