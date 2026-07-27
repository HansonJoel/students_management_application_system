const Joi = require("joi");

const validateChangePassword = (req, res, next) => {
  const schema = Joi.object({
    currentPassword: Joi.string().required().messages({
      "string.empty": "Current password is required.",
      "any.required": "Current password is required.",
    }),

    newPassword: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
      .required()
      .messages({
        "string.min": "New password must be at least 8 characters long.",

        "string.pattern.base":
          "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",

        "string.empty": "New password is required.",

        "any.required": "New password is required.",
      }),

    confirmPassword: Joi.string()
      .valid(Joi.ref("newPassword"))
      .required()
      .messages({
        "any.only": "New password and confirm password do not match.",

        "string.empty": "Please confirm your new password.",

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

module.exports = {
  validateChangePassword,
};
