import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    dose: {
      type: String,
      required: true,
    },

    instructions: {
      type: String,
      required: true,
    },

    remainingDays: {
      type: Number,
      min: 0,
      default: 30,
    },

    active: {
      type: Boolean,
      default: true,
    },

    lastTakenAt: Date,
  },
  {
    timestamps: true,
  }
);

export const Medication = mongoose.model("Medication", schema);