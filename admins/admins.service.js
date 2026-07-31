const studentsModel = require("../students/students.model");
const AppError = require("../utils/AppError");

const createAdmin = async ({
  firstName,
  lastName,
  email,
  phone,
  dateOfBirth,
  gender,
  password,
}) => {
  // Check if email already exists
  const existingUser = await studentsModel.findOne({ email });

  if (existingUser) {
    throw new AppError("A user with this email already exists.", 409);
  }

  // Create admin
  const admin = await studentsModel.create({
    firstName,
    lastName,
    email,
    phone,
    dateOfBirth,
    gender,
    password,
    role: "admin",
  });

  return admin;
};

// Get all administrators
const getAllAdmins = async () => {
  const admins = await studentsModel
    .find({ role: "admin" })
    .select("-password -passwordResetToken -passwordResetExpires");

  return admins;
};

// Get a single administrator
const getAdmin = async (id) => {
  const admin = await studentsModel
    .findOne({ _id: id, role: "admin" })
    .select("-password -passwordResetToken -passwordResetExpires");

  if (!admin) {
    throw new AppError("Administrator not found", 404);
  }

  return admin;
};

// Update an administrator
const updateAdmin = async (id, updateData) => {
  const admin = await studentsModel.findOne({
    _id: id,
    role: "admin",
  });

  if (!admin) {
    throw new AppError("Administrator not found", 404);
  }

  // Fields a Super Admin is allowed to update
  const allowedFields = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "dateOfBirth",
    "gender",
  ];

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      admin[field] = updateData[field];
    }
  });

  await admin.save();

  // Don't return sensitive information
  admin.password = undefined;
  admin.passwordResetToken = undefined;
  admin.passwordResetExpires = undefined;

  return admin;
};

// Deactivate an administrator
const deactivateAdmin = async (id) => {
  const admin = await studentsModel.findOne({
    _id: id,
    role: "admin",
  });

  if (!admin) {
    throw new AppError("Administrator not found", 404);
  }

  // Check if already inactive
  if (!admin.isActive) {
    throw new AppError("Administrator is already deactivated.", 400);
  }

  admin.isActive = false;

  await admin.save();

  return admin;
};

// Reactivate an administrator
// IMPORTANT:
// Your schema has a pre(/^find/) middleware that automatically
// filters out isActive: false.
//
// Therefore, findOne() cannot find an inactive admin.
//
// We use findOne({ ..., isActive: false }) but your middleware
// would still add isActive: true.
const reactivateAdmin = async (id) => {
  const admin = await studentsModel
    .findOne({
      _id: id,
      role: "admin",
    })
    .setOptions({ includeInactive: true });

  if (!admin) {
    throw new AppError("Administrator not found.", 404);
  }

  if (admin.isActive) {
    throw new AppError("Administrator is already active.", 400);
  }

  admin.isActive = true;

  await admin.save();

  return admin;
};

module.exports = {
  createAdmin,
  getAllAdmins,
  getAdmin,
  updateAdmin,
  deactivateAdmin,
  reactivateAdmin,
};
