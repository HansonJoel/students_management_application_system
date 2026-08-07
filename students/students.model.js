const mongoose = require("mongoose");
const departmentCodes = require("../config/departments");

const studentSchema = new mongoose.Schema(
  {
    // Link this student profile to a User account
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },

    department: {
      type: String,
      enum: Object.keys(departmentCodes),
      required: true,
    },

    level: {
      type: String,
      enum: ["100", "200", "300", "400", "500"],
      required: true,
    },

    studentId: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Student", studentSchema);
