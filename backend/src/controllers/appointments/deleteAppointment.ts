import type { Response, NextFunction } from "express";

import type { AuthRequest } from "../../middleware/auth.js";
import { Appointment } from "../../models/Appointment.js";

export async function deleteAppointment(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const appointment = await Appointment.findOneAndDelete({
      _id: req.params.id,
      patient: req.user!.id,
      status: "cancelled",
    });

    if (!appointment) {
      return res.status(404).json({
        message:
          "Appointment not found or must be cancelled before deletion",
      });
    }

    res.json({
      message: "Appointment deleted successfully",
      id: appointment._id,
    });
  } catch (error) {
    next(error);
  }
}