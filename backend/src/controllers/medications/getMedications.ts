import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../middleware/auth.js";
import { Medication } from "../../models/Medication.js";

export async function getMedications(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const medications = await Medication.find({
      patient: req.user!.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json(medications);
  } catch (error) {
    next(error);
  }
}