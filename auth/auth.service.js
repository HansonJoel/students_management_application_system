const studentsModel = require("../students/students.model");
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
  studentId,
  password,
}) => {
  const auth = new studentsModel.create({
    firstName,
    lastName,
    email,
    phone,
    dateOfBirth,
    gender,
    department,
    level,
    studentId,
    password, // plain password for now
  });

  return auth;
};

const login = async (data) => {
  const { email, password } = data;
  const auth = await studentsModel.findOne({ email });
  // check if email/password provided
  if (!email || email === "") {
    const error = new AppError("Email is not Provided", 400);
    return error;
  }

  if (!password || password === "") {
    const error = new AppError("Password is not Provided", 400);
    return error;
  }

  if (!auth) {
    const error = new AppError("Invalid email or password", 401);
    return error;
  }
  return auth;
};

module.exports = {
  signup,
  login,
};
