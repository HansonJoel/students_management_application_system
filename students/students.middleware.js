const Joi = require("joi");

const validateCreateStudents = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    age: Joi.string().required(),
    gender: Joi.string().required().valid("male", "female"),
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

module.exports = {
  validateCreateStudents,
};
