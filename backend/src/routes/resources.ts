import { Router } from "express";
import type { Model } from "mongoose";
import { z } from "zod";

import {
  requireAuth,
  type AuthRequest,
} from "../middleware/auth.js";

import { Medication } from "../models/Medication.js";
import { Message } from "../models/Message.js";
import { HealthRecord } from "../models/HealthRecord.js";

const router = Router();

router.use(requireAuth);

const models: Record<string, Model<any>> = {
  medications: Medication,
  messages: Message,
  records: HealthRecord,
};

// GET patient resources
for (const [path, Model] of Object.entries(models)) {
  router.get(`/${path}`, async (req: AuthRequest, res, next) => {
    try {
      const items = await Model.find({
        patient: req.user!.id,
      })
        .sort({ createdAt: -1 })
        .lean();

      res.json(items);
    } catch (error) {
      next(error);
    }
  });
}

// MARK medication as taken
router.patch(
  "/medications/:id/taken",
  async (req: AuthRequest, res, next) => {
    try {
      const medication = await Medication.findOneAndUpdate(
        {
          _id: req.params.id,
          patient: req.user!.id,
          active: true,
        },
        {
          lastTakenAt: new Date(),
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
);

// SEND message
router.post(
  "/messages",
  async (req: AuthRequest, res, next) => {
    try {
      const data = z
        .object({
          body: z.string().min(1).max(2000),
        })
        .parse(req.body);

      const message = await Message.create({
        patient: req.user!.id,
        senderName: "Patient",
        body: data.body,
        read: true,
      });

      res.status(201).json(message);
    } catch (error) {
      next(error);
    }
  }
);

export default router;