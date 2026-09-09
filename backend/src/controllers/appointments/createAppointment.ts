import type { Response, NextFunction } from "express";

import type { AuthRequest } from "../../middleware/auth.js";
import { Appointment } from "../../models/Appointment.js";
import { createAppointmentSchema } from "../../validation/appointments/appointmentSchemas.js";

export async function createAppointment(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const data = createAppointmentSchema.parse(req.body);

    const appointment = await Appointment.create({
      ...data,
      patient: req.user!.id,
    });

    res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
}