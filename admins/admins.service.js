const User = require("../users/users.model");
const Admin = require("./admins.model");
const AppError = require("../utils/AppError");

// Create a new administrator
const createAdmin = async ({
  firstName,
  lastName,
  email,
  phone,
  dateOfBirth,
  gender,
  password,
}) => {
  // 1. Check whether the email is already registered
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("A user with this email already exists.", 409);
  }

  // 2. Create the authentication account
  const user = await User.create({
    email,
    password,
    role: "admin",
  });

  // 3. Create the admin profile
  const admin = await Admin.create({
    user: user._id,
    firstName,
    lastName,
    phone,
    dateOfBirth,
    gender,
  });

  // 4. Return the admin profile
  return admin;
};


// Get all administrators
const getAllAdmins = async () => {
  const admins = await Admin.find().populate({
    path: "user",
    select: "email role isActive lastLogin",
  });

  return admins;
};

// Get a single administrator
const getAdmin = async (id) => {
  const admin = await Admin.findById(id).populate({
    path: "user",
    select: "email role isActive lastLogin",
  });

  if (!admin) {
    throw new AppError("Administrator not found.", 404);
  }

  return admin;
};

// Update an administrator
const updateAdmin = async (id, updateData) => {
  const admin = await Admin.findById(id);

  if (!admin) {
    throw new AppError("Administrator not found.", 404);
  }

  const allowedFields = [
    "firstName",
    "lastName",
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

  return admin;
};

// Deactivate an administrator
const deactivateAdmin = async (id) => {
  const admin = await Admin.findById(id);

  if (!admin) {
    throw new AppError("Administrator not found.", 404);
  }

  const user = await User.findById(admin.user);

  if (!user) {
    throw new AppError(
      "User account associated with this administrator was not found.",
      404,
    );
  }

  if (!user.isActive) {
    throw new AppError("Administrator is already deactivated.", 400);
  }

  user.isActive = false;

  await user.save();

  return {
    admin,
    user,
  };
};

// Reactivate an administrator
const reactivateAdmin = async (id) => {
  const admin = await Admin.findById(id);

  if (!admin) {
    throw new AppError("Administrator not found.", 404);
  }

  const user = await User.findById(admin.user).setOptions({
    includeInactive: true,
  });

  if (!user) {
    throw new AppError(
      "User account associated with this administrator was not found.",
      404,
    );
  }

  if (user.isActive) {
    throw new AppError("Administrator is already active.", 400);
  }

  user.isActive = true;

  await user.save();

  return {
    admin,
    user,
  };
};
module.exports = {
  createAdmin,
  getAllAdmins,
  getAdmin,
  updateAdmin,
  deactivateAdmin,
  reactivateAdmin,
};
