const Router = require("express").Router;

const adminController = require("./admins.controller");
const adminValidation = require("./admins.validation");
const authMiddleware = require("../auth/auth.middleware");

const adminRouter = Router();

// SUPER ADMIN: Create Admin
adminRouter.post(
  "/",
  authMiddleware.isAuthenticated,
  authMiddleware.restrictTo("superAdmin"),
  adminValidation.validateCreateAdmin,
  adminController.createAdminController,
);

// SUPER ADMIN: Get all admins
adminRouter.get(
  "/",
  authMiddleware.isAuthenticated,
  authMiddleware.restrictTo("superAdmin"),
  adminController.getAllAdminsController,
);

// SUPER ADMIN: Get a single admin
adminRouter.get(
  "/:id",
  authMiddleware.isAuthenticated,
  authMiddleware.restrictTo("superAdmin"),
  adminController.getAdminController,
);

// SUPER ADMIN: Update an admin
adminRouter.patch(
  "/:id",
  authMiddleware.isAuthenticated,
  authMiddleware.restrictTo("superAdmin"),
  adminValidation.validateUpdateAdmin,
  adminController.updateAdminController,
);

// SUPER ADMIN: Deactivate an admin
adminRouter.patch(
  "/deactivate/:id",
  authMiddleware.isAuthenticated,
  authMiddleware.restrictTo("superAdmin"),
  adminController.deactivateAdminController,
);

// SUPER ADMIN: Reactivate an admin
adminRouter.patch(
  "/reactivate/:id",
  authMiddleware.isAuthenticated,
  authMiddleware.restrictTo("superAdmin"),
  adminController.reactivateAdminController,
);

module.exports = adminRouter;
