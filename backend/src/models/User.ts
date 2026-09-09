import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["patient", "provider", "admin"],
      default: "patient",
    },

    avatarUrl: {
      type: String,
      required: true,
    },

    dateOfBirth: Date,

    phone: String,
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", schema);