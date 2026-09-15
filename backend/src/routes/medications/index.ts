import { Router } from "express";

import { requireAuth } from "../../middleware/auth.js";

import { getMedications } from "../../controllers/medications/getMedications.js";
import { createMedication } from "../../controllers/medications/createMedication.js";
import { updateMedication } from "../../controllers/medications/updateMedication.js";
import { cancelMedication } from "../../controllers/medications/cancelMedication.js";
import { markMedicationTaken } from "../../controllers/medications/markMedicationTaken.js";

const router = Router();

router.use(requireAuth);

// GET all medications
router.get("/", getMedications);

// CREATE medication
router.post("/", createMedication);

// UPDATE medication
router.patch("/:id", updateMedication);

// CANCEL medication
router.patch("/:id/cancel", cancelMedication);

// MARK medication as taken
router.patch("/:id/taken", markMedicationTaken);

export default router;