const Router = require("express").Router;

const superAdminController = require("./superAdmins.controller");
const superAdminValidation = require("./superAdmins.validation");
const superAdminMiddleware = require("./superAdmins.middleware");
const authMiddleware = require("../auth/auth.middleware");
const upload = require("../middleware/upload.middleware");

const superAdminRouter = Router();

// CREATE SUPER ADMIN
// Only  the primary Super Admin can reach this endpoint and create other Super Admins. This is to ensure that there is always a single point of control for the Super Admin role.
superAdminRouter.post(
  "/",
  authMiddleware.isAuthenticated,
  authMiddleware.restrictTo("superAdmin"),
  superAdminMiddleware.requirePrimarySuperAdmin,
  superAdminValidation.validateCreateSuperAdmin,
  superAdminController.createSuperAdminController,
);

// GET MY SUPER ADMIN PROFILE
superAdminRouter.get(
  "/me",
  authMiddleware.isAuthenticated,
  authMiddleware.restrictTo("superAdmin"),
  superAdminController.getMySuperAdminProfileController,
);

// UPDATE MY SUPER ADMIN PROFILE
superAdminRouter.patch(
  "/me",
  authMiddleware.isAuthenticated,
  authMiddleware.restrictTo("superAdmin"),
  superAdminValidation.validateUpdateSuperAdminProfile,
  superAdminController.updateMySuperAdminProfileController,
);

// UPLOAD MY AVATAR
superAdminRouter.patch(
  "/me/avatar",
  authMiddleware.isAuthenticated,
  authMiddleware.restrictTo("superAdmin"),
  upload.single("avatar"),
  superAdminController.uploadSuperAdminAvatarController,
);

// REMOVE MY AVATAR
superAdminRouter.delete(
  "/me/avatar",
  authMiddleware.isAuthenticated,
  authMiddleware.restrictTo("superAdmin"),
  superAdminController.removeSuperAdminAvatarController,
);

// PRIMARY SUPER ADMIN: GET ALL SUPER ADMINS
superAdminRouter.get(
  "/",
  authMiddleware.isAuthenticated,
  authMiddleware.restrictTo("superAdmin"),
  superAdminMiddleware.requirePrimarySuperAdmin,
  superAdminController.getAllSuperAdminsController,
);

// =========================================
// GET SINGLE SUPER ADMIN
// PRIMARY SUPER ADMIN ONLY
// =========================================
superAdminRouter.get(
  "/:id",
  authMiddleware.isAuthenticated,
  authMiddleware.restrictTo("superAdmin"),
  superAdminMiddleware.requirePrimarySuperAdmin,
  superAdminController.getSuperAdminByIdController,
);

// PRIMARY SUPER ADMIN: DEACTIVATE SUPER ADMIN
superAdminRouter.patch(
  "/deactivate/:id",
  authMiddleware.isAuthenticated,
  authMiddleware.restrictTo("superAdmin"),
  superAdminMiddleware.requirePrimarySuperAdmin,
  superAdminController.deactivateSuperAdminController,
);

// PRIMARY SUPER ADMIN: REACTIVATE SUPER ADMIN
superAdminRouter.patch(
  "/reactivate/:id",
  authMiddleware.isAuthenticated,
  authMiddleware.restrictTo("superAdmin"),
  superAdminMiddleware.requirePrimarySuperAdmin,
  superAdminController.reactivateSuperAdminController,
);

// PRIMARY SUPER ADMIN: Update a secondary Super Admin profile. This endpoint is restricted to the primary Super Admin only, ensuring that only the primary Super Admin can update the profiles of secondary Super Admins.
superAdminRouter.patch(
  "/:id",
  authMiddleware.isAuthenticated,
  authMiddleware.restrictTo("superAdmin"),
  superAdminMiddleware.requirePrimarySuperAdmin,
  superAdminValidation.validateUpdateSecondarySuperAdmin,
  superAdminController.updateSecondarySuperAdminController,
);

module.exports = superAdminRouter;
