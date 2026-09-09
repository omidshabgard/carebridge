import type { Response, NextFunction } from "express";

import type { AuthRequest } from "../../middleware/auth.js";
import { Appointment } from "../../models/Appointment.js";

export async function getAppointments(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const appointments = await Appointment.find({
      patient: req.user!.id,
    })
      .sort({ startsAt: 1 })
      .lean();

    res.json(appointments);
  } catch (error) {
    next(error);
  }
}