import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../middleware/auth.js";
import { Medication } from "../../models/Medication.js";

export async function cancelMedication(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const medication = await Medication.findOneAndUpdate(
      {
        _id: req.params.id,
        patient: req.user!.id,
        active: true,
      },
      {
        $set: {
          active: false,
        },
      },
      {
        new: true,
      }
    );

    if (!medication) {
      return res.status(404).json({
        message: "Medication not found",
      });
    }

    res.json(medication);
  } catch (error) {
    next(error);
  }
}