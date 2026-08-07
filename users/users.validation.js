const Joi = require("joi");

const validateCreateUser = (req, res, next) => {
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

    role: Joi.forbidden().messages({
      "any.unknown": "You are not allowed to specify a role.",
    }),
  });

  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: false,
  });

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.details.map((err) => err.message).join(". "),
    });
  }

  req.body = value;

  next();
};

module.exports = {
  validateCreateUser,
};
