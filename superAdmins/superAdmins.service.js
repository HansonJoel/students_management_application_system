const fs = require("fs");
const path = require("path");

const User = require("../users/users.model");
const SuperAdminProfile = require("./superAdmins.model");
const AppError = require("../utils/AppError");

// =========================================
// CREATE SUPER ADMIN
// =========================================
const createSuperAdmin = async ({
  email,
  password,
  firstName,
  lastName,
  title,
  phone,
  recoveryEmail,
  dateOfBirth,
  gender,
  avatar,
  timezone,
  receiveSecurityAlerts,
  permissions,
}) => {
  // 1. Check whether email already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("A user with this email already exists.", 409);
  }

  // 2. Create authentication account
  const user = await User.create({
    email,
    password,
    role: "superAdmin",
  });

  try {
    // 3. Create Super Admin profile
    const profile = await SuperAdminProfile.create({
      user: user._id,
      firstName,
      lastName,
      title,
      phone,
      recoveryEmail,
      dateOfBirth,
      gender,
      avatar,
      timezone,
      receiveSecurityAlerts,
      isPrimary: false,
      permissions,
    });

    // 4. Return both records
    return {
      user,
      profile,
    };
  } catch (error) {
    // If profile creation fails, remove the User account
    // so we don't end up with an incomplete Super Admin.
    await User.findByIdAndDelete(user._id);

    throw error;
  }
};

// =========================================
// GET ALL SUPER ADMINS
// =========================================
const getAllSuperAdmins = async () => {
  const profiles = await SuperAdminProfile.find()
    .populate({
      path: "user",
      select: "email role isActive lastLogin createdAt",
    })
    .sort({ createdAt: -1 });

  return profiles;
};

// UPLOAD SUPER ADMIN AVATAR
const uploadSuperAdminAvatar = async (userId, file) => {
  // Ensure a file was uploaded
  if (!file) {
    throw new AppError("Please upload an image.", 400);
  }

  // Find the Super Admin profile
  const profile = await SuperAdminProfile.findOne({
    user: userId,
  });

  if (!profile) {
    throw new AppError("Super Admin profile not found.", 404);
  }

  // Delete previous avatar if one exists
  if (profile.avatar) {
    const oldImagePath = path.join(
      __dirname,
      "..",
      profile.avatar.replace(/^\/+/, ""),
    );

    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }
  }

  // Save the avatar path
  profile.avatar = `/uploads/${file.filename}`;

  await profile.save();

  return profile;
};

// REMOVE MY AVATAR
const removeSuperAdminAvatar = async (userId) => {
  // Find profile
  const profile = await SuperAdminProfile.findOne({
    user: userId,
  });

  if (!profile) {
    throw new AppError("Super Admin profile not found.", 404);
  }

  // Ensure an avatar exists
  if (!profile.avatar) {
    throw new AppError("No avatar found for this Super Admin.", 400);
  }

  // Build file path
  const avatarPath = path.join(
    __dirname,
    "..",
    profile.avatar.replace(/^\/+/, ""),
  );

  // Delete file if it exists
  if (fs.existsSync(avatarPath)) {
    fs.unlinkSync(avatarPath);
  }

  // Remove reference from database
  profile.avatar = null;

  await profile.save();

  return profile;
};

// =========================================
// GET SINGLE SUPER ADMIN
// =========================================
const getSuperAdminById = async (superAdminId) => {
  const profile = await SuperAdminProfile.findOne({
    user: superAdminId,
  }).populate({
    path: "user",
    select: "email role isActive lastLogin createdAt",
  });

  if (!profile) {
    throw new AppError("Super Admin profile not found.", 404);
  }

  // Make sure the referenced user is actually a Super Admin
  if (!profile.user || profile.user.role !== "superAdmin") {
    throw new AppError("Super Admin account not found.", 404);
  }

  return profile;
};

// =========================================
// GET SUPER ADMIN PROFILE
// =========================================
const getSuperAdminProfile = async (userId) => {
  const profile = await SuperAdminProfile.findOne({
    user: userId,
  });

  if (!profile) {
    throw new AppError("Super Admin profile not found.", 404);
  }

  return profile;
};

// =========================================
// UPDATE SUPER ADMIN PROFILE
// =========================================
const updateSuperAdminProfile = async (userId, updateData) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "title",
    "phone",
    "recoveryEmail",
    "dateOfBirth",
    "gender",
    "avatar",
    "timezone",
    "receiveSecurityAlerts",
  ];

  const profile = await SuperAdminProfile.findOne({
    user: userId,
  });

  if (!profile) {
    throw new AppError("Super Admin profile not found.", 404);
  }

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      profile[field] = updateData[field];
    }
  });

  await profile.save();

  return profile;
};

// UPDATE SECONDARY SUPER ADMIN
const updateSecondarySuperAdmin = async (superAdminId, updateData) => {
  // Find the profile
  const profile = await SuperAdminProfile.findOne({
    user: superAdminId,
  });

  if (!profile) {
    throw new AppError("Super Admin profile not found.", 404);
  }

  // Primary Super Admin cannot be updated through
  // the secondary Super Admin management endpoint.
  if (profile.isPrimary) {
    throw new AppError(
      "The Primary Super Admin cannot be updated through this endpoint.",
      403,
    );
  }

  // Make sure the associated User is actually a Super Admin
  const user = await User.findById(superAdminId);

  if (!user || user.role !== "superAdmin") {
    throw new AppError("Super Admin account not found.", 404);
  }

  // Fields that can be changed
  const allowedFields = [
    "firstName",
    "lastName",
    "title",
    "phone",
    "recoveryEmail",
    "dateOfBirth",
    "gender",
    "avatar",
    "timezone",
    "receiveSecurityAlerts",
  ];

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      profile[field] = updateData[field];
    }
  });

  // Update permissions
  if (updateData.permissions) {
    profile.permissions = {
      ...profile.permissions,
      ...updateData.permissions,
    };
  }

  await profile.save();

  return profile;
};

// DEACTIVATE SUPER ADMIN
const deactivateSuperAdmin = async (superAdminId) => {
  const profile = await SuperAdminProfile.findOne({
    user: superAdminId,
  });

  if (!profile) {
    throw new AppError("Super Admin profile not found.", 404);
  }

  // Primary Super Admin cannot be deactivated
  if (profile.isPrimary) {
    throw new AppError("The Primary Super Admin cannot be deactivated.", 403);
  }

  // Find the authentication account
  const user = await User.findById(superAdminId);

  if (!user || user.role !== "superAdmin") {
    throw new AppError("Super Admin account not found.", 404);
  }

  // Check if already inactive
  if (!user.isActive) {
    throw new AppError("Super Admin is already deactivated.", 400);
  }

  user.isActive = false;

  await user.save({ validateBeforeSave: false });

  return {
    userId: user._id,
    isActive: user.isActive,
  };
};

// REACTIVATE SUPER ADMIN
const reactivateSuperAdmin = async (superAdminId) => {
  // We need to find the profile regardless of whether
  // the account is currently active.
  const profile = await SuperAdminProfile.findOne({
    user: superAdminId,
  });

  if (!profile) {
    throw new AppError("Super Admin profile not found.", 404);
  }

  // A primary Super Admin should never normally be inactive,
  // but this prevents accidental manipulation of the primary account.
  if (profile.isPrimary) {
    throw new AppError(
      "The Primary Super Admin cannot be managed through this endpoint.",
      403,
    );
  }

  const user = await User.findById(superAdminId);

  if (!user || user.role !== "superAdmin") {
    throw new AppError("Super Admin account not found.", 404);
  }

  // Check if already active
  if (user.isActive) {
    throw new AppError("Super Admin is already active.", 400);
  }

  user.isActive = true;

  await user.save({ validateBeforeSave: false });

  return {
    userId: user._id,
    isActive: user.isActive,
  };
};

module.exports = {
  createSuperAdmin,
  getSuperAdminProfile,
  uploadSuperAdminAvatar,
  removeSuperAdminAvatar,
  updateSuperAdminProfile,
  getAllSuperAdmins,
  getSuperAdminById,
  updateSecondarySuperAdmin,
  deactivateSuperAdmin,
  reactivateSuperAdmin,
};
