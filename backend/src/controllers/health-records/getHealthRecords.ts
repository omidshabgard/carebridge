import type {
  Response,
  NextFunction,
} from "express";

import {
  type AuthRequest,
} from "../../middleware/auth.js";

import {
  HealthRecord,
} from "../../models/HealthRecord.js";

export async function getHealthRecords(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const records =
      await HealthRecord.find({
        patient: req.user!.id,
      })
        .sort({
          recordDate: -1,
          createdAt: -1,
        })
        .lean();

    res.json(records);
  } catch (error) {
    next(error);
  }
}