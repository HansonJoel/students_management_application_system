const departmentCodes = require("../config/departments");
const Joi = require("joi");

const validateCreateStudents = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().trim().required(),

    lastName: Joi.string().trim().required(),

    email: Joi.string().email().trim().lowercase().required(),

    phone: Joi.string().trim().required(),

    dateOfBirth: Joi.date().required(),

    gender: Joi.string().valid("male", "female").required(),

    department: Joi.string()
      .valid(...Object.keys(departmentCodes))
      .required(),

    level: Joi.string().valid("100", "200", "300", "400", "500").required(),

    password: Joi.string().min(8).required(),
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

// The validateBulkCreateStudents function validates the request body for creating multiple students in bulk
const validateBulkCreateStudents = (req, res, next) => {
  const schema = Joi.array().items(
    Joi.object({
      firstName: Joi.string().trim().required(),

      lastName: Joi.string().trim().required(),

      email: Joi.string().email().trim().lowercase().required(),

      phone: Joi.string().trim().required(),

      dateOfBirth: Joi.date().required(),

      gender: Joi.string().valid("male", "female").required(),

      department: Joi.string()
        .valid(...Object.keys(departmentCodes))
        .required(),

      level: Joi.string().valid("100", "200", "300", "400", "500").required(),

      password: Joi.string().min(8).required(),
    }),
  );

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
  validateCreateStudents,
  validateBulkCreateStudents,
};
