import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    providerName: {
      type: String,
      required: true,
    },

    specialty: {
      type: String,
      required: true,
    },

    startsAt: {
      type: Date,
      required: true,
    },

    visitType: {
      type: String,
      enum: ["in-person", "video"],
      default: "in-person",
    },

    status: {
      type: String,
      enum: ["requested", "confirmed", "completed", "cancelled"],
      default: "requested",
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Appointment = mongoose.model("Appointment", schema);