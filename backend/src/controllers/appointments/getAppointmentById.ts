import type { Response, NextFunction } from "express";

import type { AuthRequest } from "../../middleware/auth.js";
import { Appointment } from "../../models/Appointment.js";

export async function getAppointmentById(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patient: req.user!.id,
    }).lean();

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    res.json(appointment);
  } catch (error) {
    next(error);
  }
}