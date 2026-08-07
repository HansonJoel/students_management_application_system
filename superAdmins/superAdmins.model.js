const mongoose = require("mongoose");

const superAdminProfileSchema = new mongoose.Schema(
  {
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

    title: {
      type: String,
      trim: true,
      default: "Super Administrator",
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    recoveryEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },

    dateOfBirth: {
      type: Date,
    },

    gender: {
      type: String,
      enum: ["male", "female"],
    },

    avatar: {
      type: String,
      default: null,
    },

    timezone: {
      type: String,
      default: "UTC",
    },

    receiveSecurityAlerts: {
      type: Boolean,
      default: true,
    },

    // Identifies the Primary Super Admin
    isPrimary: {
      type: Boolean,
      default: false,
    },

    // Permissions for Secondary Super Admins
    permissions: {
      manageSuperAdmins: {
        type: Boolean,
        default: false,
      },

      manageAdmins: {
        type: Boolean,
        default: false,
      },

      manageStudents: {
        type: Boolean,
        default: false,
      },

      viewReports: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("SuperAdminProfile", superAdminProfileSchema);
