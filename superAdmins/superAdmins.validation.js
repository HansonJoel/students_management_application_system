const Joi = require("joi");

// =========================================
// CREATE SUPER ADMIN
// =========================================
const validateCreateSuperAdmin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().trim().lowercase().required().messages({
      "string.email": "Please provide a valid email address.",
      "string.empty": "Email is required.",
      "any.required": "Email is required.",
    }),

    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
      .required()
      .messages({
        "string.min": "Password must be at least 8 characters long.",
        "string.pattern.base":
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
        "string.empty": "Password is required.",
        "any.required": "Password is required.",
      }),

    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Passwords do not match.",
        "string.empty": "Please confirm your password.",
        "any.required": "Confirm password is required.",
      }),

    firstName: Joi.string().trim().required().messages({
      "string.empty": "First name is required.",
      "any.required": "First name is required.",
    }),

    lastName: Joi.string().trim().required().messages({
      "string.empty": "Last name is required.",
      "any.required": "Last name is required.",
    }),

    title: Joi.string().trim().optional(),

    phone: Joi.string().trim().required().messages({
      "string.empty": "Phone number is required.",
      "any.required": "Phone number is required.",
    }),

    recoveryEmail: Joi.string().email().trim().lowercase().optional().messages({
      "string.email": "Please provide a valid recovery email address.",
    }),

    dateOfBirth: Joi.date().optional(),

    gender: Joi.string().valid("male", "female").optional(),

    avatar: Joi.string().trim().optional(),

    timezone: Joi.string().trim().optional(),

    receiveSecurityAlerts: Joi.boolean().optional(),

    // SECONDARY SUPER ADMIN PERMISSIONS
    permissions: Joi.object({
      manageAdmins: Joi.boolean().optional(),
      manageStudents: Joi.boolean().optional(),
      viewReports: Joi.boolean().optional(),
    }).optional(),
  }).unknown(false);

  const { error } = schema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.details.map((err) => err.message).join(". "),
    });
  }

  next();
};

// =========================================
// UPDATE SUPER ADMIN PROFILE
// =========================================
const validateUpdateSuperAdminProfile = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().trim(),

    lastName: Joi.string().trim(),

    title: Joi.string().trim(),

    phone: Joi.string().trim(),

    recoveryEmail: Joi.string().email().trim().lowercase().messages({
      "string.email": "Please provide a valid recovery email address.",
    }),

    dateOfBirth: Joi.date(),

    gender: Joi.string().valid("male", "female"),

    avatar: Joi.string().trim(),

    timezone: Joi.string().trim(),

    receiveSecurityAlerts: Joi.boolean(),

    permissions: Joi.object({
      manageAdmins: Joi.boolean(),
      manageStudents: Joi.boolean(),
      viewReports: Joi.boolean(),
    }).optional(),
  })
    .min(1)
    .unknown(false);

  const { error } = schema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.details.map((err) => err.message).join(". "),
    });
  }

  next();
};

// =========================================
// UPDATE SECONDARY SUPER ADMIN
// =========================================
const validateUpdateSecondarySuperAdmin = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().trim().optional(),

    lastName: Joi.string().trim().optional(),

    title: Joi.string().trim().optional(),

    phone: Joi.string().trim().optional(),

    recoveryEmail: Joi.string().email().trim().lowercase().optional(),

    dateOfBirth: Joi.date().optional(),

    gender: Joi.string().valid("male", "female").optional(),

    avatar: Joi.string().trim().optional(),

    timezone: Joi.string().trim().optional(),

    receiveSecurityAlerts: Joi.boolean().optional(),

    permissions: Joi.object({
      manageAdmins: Joi.boolean(),
      manageStudents: Joi.boolean(),
      viewReports: Joi.boolean(),
    }).optional(),
  })
    .min(1)
    .unknown(false);

  const { error } = schema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.details.map((err) => err.message).join(". "),
    });
  }

  next();
};

module.exports = {
  validateCreateSuperAdmin,
  validateUpdateSuperAdminProfile,
  validateUpdateSecondarySuperAdmin,
};
