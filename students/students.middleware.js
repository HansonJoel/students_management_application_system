const Joi = require("joi");

const validateCreateStudents = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    dateOfBirth: Joi.date().required(),
    gender: Joi.string().valid("male", "female").required(),
    department: Joi.string().required(),
    level: Joi.string().valid("100", "200", "300", "400", "500").required(),
    studentId: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      code: 400,
      message: error.message,
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

      email: Joi.string().email().required(),

      phone: Joi.string().required(),

      dateOfBirth: Joi.date().required(),

      gender: Joi.string().valid("male", "female").required(),

      department: Joi.string().required(),

      level: Joi.string().valid("100", "200", "300", "400", "500").required(),

      studentId: Joi.string().required(),
    }),
  );

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      code: 400,
      message: error.message,
    });
  }

  next();
};

module.exports = {
  validateCreateStudents,
  validateBulkCreateStudents,
};
