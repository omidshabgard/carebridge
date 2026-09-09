import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.js";
import resourceRoutes from "./routes/resources.js";
import appointmentRoutes from "./routes/appointments/index.js";

import {
  errorHandler,
  notFound,
} from "./middleware/error.js";

export const app = express();

app.disable("x-powered-by");

app.use(helmet());

app.use(
  cors({
    origin: (
      process.env.CLIENT_ORIGIN ?? "http://localhost:3000"
    ).split(","),
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "100kb",
  })
);

app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 25,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  }),
  authRoutes
);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "carebridge-api",
  });
});

// Appointment routes
app.use("/api/appointments", appointmentRoutes);

// Other patient resources
app.use("/api", resourceRoutes);

app.use(notFound);

app.use(errorHandler);