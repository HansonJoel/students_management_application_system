const studentService = require("../students/students.service");
const studentsModel = require("../students/students.model");
const generateToken = require("../utils/generateToken");
const AppError = require("../utils/AppError");
const bcrypt = require("bcryptjs");

// The signup function creates a new student and generates a JWT token for authentication
const signup = async (data) => {
  // Check if email already exists
  const existingStudent = await studentsModel.findOne({ email: data.email });

  if (existingStudent) {
    throw new AppError("Email already exists", 409);
  }

  const student = await studentService.createStudent(data);

  const token = generateToken(student._id, student.role);

  student.password = undefined;

  return {
    student,
    token,
  };
};

// The login function authenticates a user based on the provided email and password
const login = async ({ email, password }) => {
  if (!email || email === "") {
    throw new AppError("Email is required", 400);
  }

  if (!password || password === "") {
    throw new AppError("Password is required", 400);
  }

  // check if the user exists in the database and select the password field for comparison
  const student = await studentsModel.findOne({ email }).select("+password");

  if (!student) {
    throw new AppError("Invalid email or password", 401);
  }

  // Check if the provided password matches the stored hashed password
  const isPasswordCorrect = await student.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new AppError("Password is not correct", 401);
  }

  student.lastLogin = new Date();
  await student.save({ validateBeforeSave: false });

  student.password = undefined;

  const token = generateToken(student._id, student.role);

  return {
    student,
    token,
  };
};

module.exports = {
  signup,
  login,
};
