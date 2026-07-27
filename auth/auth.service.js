const studentService = require("../students/students.service");
const studentsModel = require("../students/students.model");
const generateToken = require("../utils/generateToken");
const AppError = require("../utils/AppError");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

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

// The changePassword function allows a user to change their password
const changePassword = async (userId, { currentPassword, newPassword }) => {
  // 1. Find the student and explicitly select the password
  const student = await studentsModel.findById(userId).select("+password");

  if (!student) {
    throw new AppError("Student no longer exists.", 401);
  }

  // 2. Check if the current password is correct
  const isPasswordCorrect = await student.comparePassword(currentPassword);

  if (!isPasswordCorrect) {
    throw new AppError("Your current password is incorrect.", 401);
  }

  // 3. Set the new password
  student.password = newPassword;

  // 4. Record when the password was changed
  student.passwordChangedAt = new Date();

  // 5. Save the student
  // The pre-save middleware in students.model.js
  // will automatically hash the new password
  await student.save();

  return student;
};

// Forgot password
const forgotPassword = async (email) => {
  // 1. Find the student using their email
  const student = await studentsModel.findOne({ email });

  // 2. If student does not exist, return an error
  if (!student) {
    throw new AppError("There is no student with this email address.", 404);
  }

  // 3. Generate a password reset token
  const resetToken = student.createPasswordResetToken();

  // 4. Save the hashed token and expiration time to the database
  await student.save({ validateBeforeSave: false });

  // 5. For now, return the token
  // Later, we will send this token through email instead
  return resetToken;
};

// RESET PASSWORD
const resetPassword = async (resetToken, newPassword, confirmPassword) => {
  // 1. Hash the token received from the user
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // 2. Find the student using the hashed token
  // 3. Make sure the token has not expired
  const student = await studentsModel
    .findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        $gt: Date.now(),
      },
    })
    .select("+password");

  // 4. If no student is found, the token is invalid or expired
  if (!student) {
    throw new AppError("Password reset token is invalid or has expired.", 400);
  }

  // 5. Update the student's password
  student.password = newPassword;

  // 6. Update passwordChangedAt
  student.passwordChangedAt = new Date();

  // 7. Remove the reset token so it cannot be reused
  student.passwordResetToken = undefined;
  student.passwordResetExpires = undefined;

  // 8. Save the student
  // This will trigger the pre-save middleware
  // and hash the new password
  await student.save();

  // 9. Generate a new JWT token
  const token = generateToken(student._id, student.role);

  // 10. Remove password from response
  student.password = undefined;

  return {
    student,
    token,
  };
};

module.exports = {
  signup,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
};
