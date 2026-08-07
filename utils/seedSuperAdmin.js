require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../users/users.model");
const SuperAdminProfile = require("../superAdmins/superAdmins.model");

const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB");

    // Check whether a Primary Super Admin already exists
    const existingPrimary = await SuperAdminProfile.findOne({
      isPrimary: true,
    });

    if (existingPrimary) {
      console.log("A Primary Super Admin already exists.");
      process.exit(0);
    }

    // Check whether the configured email already belongs to a user
    const existingUser = await User.findOne({
      email: process.env.SUPERADMIN_EMAIL,
    });

    if (existingUser) {
      console.log(
        "The configured Super Admin email already belongs to an existing user.",
      );
      process.exit(1);
    }

    // =========================================
    // 1. CREATE PRIMARY SUPER ADMIN USER
    // =========================================

    const user = await User.create({
      email: process.env.SUPERADMIN_EMAIL,
      password: process.env.SUPERADMIN_PASSWORD,
      role: "superAdmin",
      isActive: true,
    });

    // =========================================
    // 2. CREATE PRIMARY SUPER ADMIN PROFILE
    // =========================================

    const profile = await SuperAdminProfile.create({
      user: user._id,

      firstName: process.env.SUPERADMIN_FIRST_NAME || "System",

      lastName: process.env.SUPERADMIN_LAST_NAME || "Administrator",

      title: "Primary Super Administrator",

      phone: process.env.SUPERADMIN_PHONE,

      recoveryEmail: process.env.SUPERADMIN_RECOVERY_EMAIL,

      dateOfBirth: process.env.SUPERADMIN_DOB
        ? new Date(process.env.SUPERADMIN_DOB)
        : undefined,

      gender: process.env.SUPERADMIN_GENDER || undefined,

      timezone: process.env.SUPERADMIN_TIMEZONE || "Africa/Lagos",

      receiveSecurityAlerts: true,

      // This account is the Primary Super Admin
      isPrimary: true,

      permissions: {
        manageSuperAdmins: true,
        manageAdmins: true,
        manageStudents: true,
        viewReports: true,
      },
    });

    console.log("=================================");
    console.log("Primary Super Admin created!");
    console.log("=================================");
    console.log("Email:", user.email);
    console.log("User ID:", user._id);
    console.log("Profile ID:", profile._id);
    console.log("Primary:", profile.isPrimary);
    console.log("=================================");

    process.exit(0);
  } catch (error) {
    console.error("Failed to create Primary Super Admin:");
    console.error(error);

    process.exit(1);
  }
};

createSuperAdmin();
