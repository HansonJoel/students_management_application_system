const Joi = require("joi");

const validateCreateAdmin = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().trim().required(),

    lastName: Joi.string().trim().required(),

    email: Joi.string().email().trim().lowercase().required().messages({
      "string.email": "Please provide a valid email address.",
      "string.empty": "Email is required.",
      "any.required": "Email is required.",
    }),

    phone: Joi.string().trim().required(),

    dateOfBirth: Joi.date().required(),

    gender: Joi.string().valid("male", "female").required(),

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
  });

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

const validateUpdateAdmin = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().trim(),

    lastName: Joi.string().trim(),

    email: Joi.string().email().trim().lowercase(),

    phone: Joi.string().trim(),

    dateOfBirth: Joi.date(),

    gender: Joi.string().valid("male", "female"),
  }).min(1);

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
  validateCreateAdmin,
  validateUpdateAdmin,
};
