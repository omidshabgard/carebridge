import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../middleware/auth.js";
import { Medication } from "../../models/Medication.js";
import { updateMedicationSchema } from "../../validation/medications/medicationSchemas.js";

export async function updateMedication(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const data = updateMedicationSchema.parse(req.body);

    const medication = await Medication.findOneAndUpdate(
      {
        _id: req.params.id,
        patient: req.user!.id,
        active: true,
      },
      {
        $set: data,
      },
      {
        new: true,
        runValidators: true,
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