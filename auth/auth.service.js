const studentsModel = require("../students/students.model");
const generateStudentId = require("../utils/generateStudentId");
const AppError = require("../utils/AppError");

const signup = async ({
  firstName,
  lastName,
  email,
  phone,
  dateOfBirth,
  gender,
  department,
  level,
  password,
  confirmPassword,
}) => {
  const studentId = await generateStudentId(department);
  const auth = await studentsModel.create({
    firstName,
    lastName,
    email,
    phone,
    dateOfBirth,
    gender,
    department,
    level,
    studentId,
    password,
  });

  return auth;
};

const login = async (data) => {
  const { email, password } = data;
  const auth = await studentsModel.findOne({ email }).select("+password");
  // check if email/password provided
  if (!email || email === "") {
    throw new AppError("Email is not provided", 400);
  }

  if (!password || password === "") {
    throw new AppError("Password is not provided", 400);
  }

  if (!auth) {
    throw new AppError("Invalid email or password", 401);
  }
  return auth;
};

module.exports = {
  signup,
  login,
};
