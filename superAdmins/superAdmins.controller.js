const superAdminService = require("./superAdmins.service");
const catchAsync = require("../utils/catchAsync");

// CREATE SUPER ADMIN
const createSuperAdminController = catchAsync(async (req, res) => {
  const result = await superAdminService.createSuperAdmin(req.body);

  return res.status(201).json({
    message: "Super Admin created successfully.",
    data: result,
  });
});

// GET ALL SUPER ADMINS
const getAllSuperAdminsController = catchAsync(async (req, res) => {
  const superAdmins = await superAdminService.getAllSuperAdmins();

  return res.status(200).json({
    message: "Super Admins retrieved successfully.",
    data: superAdmins,
  });
});

// UPLOAD SUPER ADMIN AVATAR
const uploadSuperAdminAvatarController = catchAsync(async (req, res) => {
  const profile = await superAdminService.uploadSuperAdminAvatar(
    req.user._id,
    req.file,
  );

  return res.status(200).json({
    message: "Avatar uploaded successfully.",
    data: profile,
  });
});

// REMOVE MY AVATAR
const removeSuperAdminAvatarController = catchAsync(async (req, res) => {
  const profile = await superAdminService.removeSuperAdminAvatar(req.user._id);

  return res.status(200).json({
    message: "Avatar removed successfully.",
    data: profile,
  });
});

// =========================================
// GET SINGLE SUPER ADMIN
// =========================================
const getSuperAdminByIdController = catchAsync(async (req, res) => {
  const { id } = req.params;

  const profile = await superAdminService.getSuperAdminById(id);

  return res.status(200).json({
    message: "Super Admin retrieved successfully.",
    data: profile,
  });
});

// GET MY SUPER ADMIN PROFILE
const getMySuperAdminProfileController = catchAsync(async (req, res) => {
  const profile = await superAdminService.getSuperAdminProfile(req.user._id);

  return res.status(200).json({
    message: "Super Admin profile retrieved successfully.",
    data: profile,
  });
});

// UPDATE MY SUPER ADMIN PROFILE
const updateMySuperAdminProfileController = catchAsync(async (req, res) => {
  const profile = await superAdminService.updateSuperAdminProfile(
    req.user._id,
    req.body,
  );

  return res.status(200).json({
    message: "Super Admin profile updated successfully.",
    data: profile,
  });
});

// DEACTIVATE SUPER ADMIN
const deactivateSuperAdminController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await superAdminService.deactivateSuperAdmin(id);

  return res.status(200).json({
    message: "Super Admin deactivated successfully.",
    data: result,
  });
});

// UPDATE SECONDARY SUPER ADMIN
const updateSecondarySuperAdminController = catchAsync(async (req, res) => {
  const { id } = req.params;

  const profile = await superAdminService.updateSecondarySuperAdmin(
    id,
    req.body,
  );

  return res.status(200).json({
    message: "Super Admin updated successfully.",
    data: profile,
  });
});

// REACTIVATE SUPER ADMIN
const reactivateSuperAdminController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await superAdminService.reactivateSuperAdmin(id);

  return res.status(200).json({
    message: "Super Admin reactivated successfully.",
    data: result,
  });
});

module.exports = {
  createSuperAdminController,
  getAllSuperAdminsController,
  uploadSuperAdminAvatarController,
  removeSuperAdminAvatarController,
  getSuperAdminByIdController,
  getMySuperAdminProfileController,
  updateMySuperAdminProfileController,
  updateSecondarySuperAdminController,
  deactivateSuperAdminController,
  reactivateSuperAdminController,
};
