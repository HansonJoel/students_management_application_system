const mongoose = require("mongoose");
const departmentCodes = require("../config/departments");
const bcrypt = require("bcryptjs");

const studentSchema = new mongoose.Schema(
  {
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

    email: {
      type: String,
      required: true,
      unique: true,
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
    },

    level: {
      type: String,
      required: true,
      enum: ["100", "200", "300", "400", "500"],
    },

    studentId: {
      type: String,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Hashing the password before saving it to the database
studentSchema.pre("save", async function () {
  // skip hashing if password is not modified
  if (!this.isModified("password")) return;

  // hashing the password before saving it to the database
  const saltRounds = Number(process.env.BCRYPT_SALT) || 12;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

module.exports = mongoose.model("Student", studentSchema);
