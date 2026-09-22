import mongoose from "mongoose";

const healthRecordSchema =
  new mongoose.Schema(
    {
      patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      type: {
        type: String,
        enum: [
          "Visit summary",
          "Procedure",
          "Immunization",
          "Diagnosis",
          "Hospital",
          "Other",
        ],
        required: true,
      },

      title: {
        type: String,
        required: true,
        trim: true,
      },

      providerName: {
        type: String,
        required: true,
        trim: true,
      },

      facility: {
        type: String,
        trim: true,
      },

      recordDate: {
        type: Date,
        required: true,
      },

      summary: {
        type: String,
        required: true,
        trim: true,
      },

      diagnosis: {
        type: String,
        trim: true,
      },

      notes: {
        type: String,
        trim: true,
      },

      documentAvailable: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

healthRecordSchema.index({
  patient: 1,
  recordDate: -1,
});

export const HealthRecord =
  mongoose.model(
    "HealthRecord",
    healthRecordSchema
  );