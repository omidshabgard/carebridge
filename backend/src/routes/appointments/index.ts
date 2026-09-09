import { Router } from "express";

import { requireAuth } from "../../middleware/auth.js";

import { getAppointments } from "../../controllers/appointments/getAppointments.js";
import { getAppointmentById } from "../../controllers/appointments/getAppointmentById.js";
import { createAppointment } from "../../controllers/appointments/createAppointment.js";
import { cancelAppointment } from "../../controllers/appointments/cancelAppointment.js";

const router = Router();

router.use(requireAuth);

router.get("/", getAppointments);
router.get("/:id", getAppointmentById);
router.post("/", createAppointment);
router.patch("/:id/cancel", cancelAppointment);

export default router;