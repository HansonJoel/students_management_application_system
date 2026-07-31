require("dotenv").config();

const mongoose = require("mongoose");
const Student = require("../students/students.model");

const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB");

    // Check whether a super admin already exists
    const existingSuperAdmin = await Student.findOne({
      role: "superAdmin",
    });

    if (existingSuperAdmin) {
      console.log("A Super Admin already exists.");
      process.exit(0);
    }

    // Create the first Super Admin
    const superAdmin = await Student.create({
      firstName: "System",
      lastName: "Administrator",
      email: process.env.SUPERADMIN_EMAIL,
      phone: process.env.SUPERADMIN_PHONE,
      dateOfBirth: new Date("1990-01-01"),
      gender: "male",
      password: process.env.SUPERADMIN_PASSWORD,
      role: "superAdmin",
    });

    console.log("Super Admin created successfully.");
    console.log("Email:", superAdmin.email);

    process.exit(0);
  } catch (error) {
    console.error("Failed to create Super Admin:");
    console.error(error);

    process.exit(1);
  }
};

createSuperAdmin();
