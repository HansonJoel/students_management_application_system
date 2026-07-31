const adminService = require("./admins.service");
const catchAsync = require("../utils/catchAsync");

const createAdminController = catchAsync(async (req, res) => {
  const admin = await adminService.createAdmin(req.body);

  return res.status(201).json({
    message: "Admin created successfully.",
    data: admin,
  });
});

// GET ALL ADMINS
const getAllAdminsController = catchAsync(async (req, res) => {
  const admins = await adminService.getAllAdmins();

  return res.status(200).json({
    message: "Administrators retrieved successfully",
    data: admins,
  });
});

// GET SINGLE ADMIN
const getAdminController = catchAsync(async (req, res) => {
  const { id } = req.params;

  const admin = await adminService.getAdmin(id);

  return res.status(200).json({
    message: "Administrator retrieved successfully",
    data: admin,
  });
});

// UPDATE ADMIN
const updateAdminController = catchAsync(async (req, res) => {
  const { id } = req.params;

  const admin = await adminService.updateAdmin(id, req.body);

  return res.status(200).json({
    message: "Administrator updated successfully",
    data: admin,
  });
});

// DEACTIVATE ADMIN
const deactivateAdminController = catchAsync(async (req, res) => {
  const { id } = req.params;

  const admin = await adminService.deactivateAdmin(id);

  return res.status(200).json({
    message: "Administrator deactivated successfully.",
    data: {
      id: admin._id,
      isActive: admin.isActive,
    },
  });
});

// REACTIVATE ADMIN
const reactivateAdminController = catchAsync(async (req, res) => {
  const { id } = req.params;

  const admin = await adminService.reactivateAdmin(id);

  return res.status(200).json({
    message: "Administrator reactivated successfully.",
    data: {
      id: admin._id,
      isActive: admin.isActive,
    },
  });
});

module.exports = {
  createAdminController,
  getAllAdminsController,
  getAdminController,
  updateAdminController,
  deactivateAdminController,
  reactivateAdminController,
};
