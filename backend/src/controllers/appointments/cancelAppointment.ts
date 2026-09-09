import type { Response, NextFunction } from "express";

import type { AuthRequest } from "../../middleware/auth.js";
import { Appointment } from "../../models/Appointment.js";

export async function cancelAppointment(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      {
        _id: req.params.id,
        patient: req.user!.id,
        status: {
          $nin: ["completed", "cancelled"],
        },
      },
      {
        status: "cancelled",
      },
      {
        new: true,
      }
    );

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found or cannot be cancelled",
      });
    }

    res.json(appointment);
  } catch (error) {
    next(error);
  }
}