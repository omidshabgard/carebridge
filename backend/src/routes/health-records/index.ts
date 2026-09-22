import { Router } from "express";

import {
  requireAuth,
} from "../../middleware/auth.js";

import {
  getHealthRecords,
} from "../../controllers/health-records/getHealthRecords.js";

const router = Router();

router.use(requireAuth);

// GET all health records for the logged-in patient
router.get("/", getHealthRecords);

export default router;