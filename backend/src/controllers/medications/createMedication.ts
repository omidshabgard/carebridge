import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../middleware/auth.js";
import { Medication } from "../../models/Medication.js";
import { createMedicationSchema } from "../../validation/medications/medicationSchemas.js";

export async function createMedication(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const data = createMedicationSchema.parse(req.body);

    const medication = await Medication.create({
      patient: req.user!.id,
      name: data.name,
      dose: data.dose,
      instructions: data.instructions,
      remainingDays: data.remainingDays ?? 30,
      active: true,
    });

    res.status(201).json(medication);
  } catch (error) {
    next(error);
  }
}