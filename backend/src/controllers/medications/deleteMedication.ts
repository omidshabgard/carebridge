import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../middleware/auth.js";
import { Medication } from "../../models/Medication.js";

export async function deleteMedication(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const medication = await Medication.findOneAndDelete({
      _id: req.params.id,
      patient: req.user!.id,
      active: false,
    });

    if (!medication) {
      return res.status(404).json({
        message: "Cancelled medication not found",
      });
    }

    return res.json({
      message: "Medication deleted permanently",
      id: medication._id,
    });
  } catch (error) {
    next(error);
  }
}