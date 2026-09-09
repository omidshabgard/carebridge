import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: String,
      enum: ["lab", "visit", "immunization", "allergy", "vital"],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    summary: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "final",
    },

    recordedAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const HealthRecord = mongoose.model("HealthRecord", schema);