const studentService = require("../students/students.service");
const User = require("../users/users.model");
const generateToken = require("../utils/generateToken");
const AppError = require("../utils/AppError");
const crypto = require("crypto");
const sendEmail = require("../utils/email");

// The signup function creates a new student and generates a JWT token for authentication
// const signup = async (data) => {
//   // Check if email already exists
//   const existingStudent = await studentsModel.findOne({ email: data.email });

//   if (existingStudent) {
//     throw new AppError("Email already exists", 409);
//   }

//   const student = await studentService.createStudent(data);

//   const token = generateToken(student._id, student.role);

//   student.password = undefined;

//   return {
//     student,
//     token,
//   };
// };

// The login function authenticates a user based on the provided email and password
const login = async ({ email, password }) => {
  if (!email || email === "") {
    throw new AppError("Email is required", 400);
  }

  if (!password || password === "") {
    throw new AppError("Password is required", 400);
  }

  // Find the user by email.
  // Password is select:false in User model,
  // so explicitly include it for password comparison.
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  // Check if the account is active
  if (!user.isActive) {
    throw new AppError("Your account has been deactivated.", 403);
  }

  // Compare the provided password with the hashed password
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new AppError("Invalid email or password", 401);
  }

  // Update last login
  user.lastLogin = new Date();

  await user.save({ validateBeforeSave: false });

  // Generate JWT
  const token = generateToken(user._id, user.role);

  // Don't send sensitive information to the client
  user.password = undefined;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  return {
    token,
    user,
  };
};

// The changePassword function allows a user to change their password
const changePassword = async (userId, { currentPassword, newPassword }) => {
  // 1. Find the user from the centralized User model
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new AppError("User no longer exists.", 401);
  }

  // 2. Check the current password
  const isPasswordCorrect = await user.comparePassword(currentPassword);

  if (!isPasswordCorrect) {
    throw new AppError("Your current password is incorrect.", 401);
  }

  // 3. Set the new password
  user.password = newPassword;

  // 4. Record when the password was changed
  user.passwordChangedAt = new Date();

  // 5. Save the user
  // User model's pre-save middleware will hash the password
  await user.save();

  // 6. Remove sensitive information
  user.password = undefined;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  return user;
};

// Forgot password
const forgotPassword = async (email) => {
  // 1. Find the user using their email
  const user = await User.findOne({ email });

  // 2. Don't reveal whether the email exists
  // In a production application, this prevents email enumeration.
  if (!user) {
    return {
      message:
        "If an account with that email exists, a password reset link will be sent.",
    };
  }

  // 3. Generate a password reset token
  const resetToken = user.createPasswordResetToken();

  // 4. Save the hashed token and expiration time to the database
  await user.save({ validateBeforeSave: false });

  const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  // text version of the email
  const message = `
Hello,

You requested a password reset.

Please click the link below to reset your password:

${resetURL}

This link expires in 10 minutes.

If you didn't request this, please ignore this email.
`;

  // HTML version of the email
  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Password Reset</title>
</head>

<body style="
font-family: Arial, Helvetica, sans-serif;
background:#f4f4f4;
padding:40px;
">

<div style="
max-width:600px;
margin:auto;
background:white;
padding:40px;
border-radius:10px;
box-shadow:0 0 10px rgba(0,0,0,.08);
">

<h2 style="color:#2563eb;">
Student Management System
</h2>

<h3>Password Reset Request</h3>

<p>
Hello,
</p>

<p>
We received a request to reset your password.
Click the button below to create a new password.
</p>

<div style="text-align:center;margin:40px 0;">
<a
href="${resetURL}"
style="
background:#2563eb;
color:white;
padding:15px 30px;
text-decoration:none;
border-radius:6px;
font-weight:bold;
display:inline-block;
"
>
Reset Password
</a>
</div>

<p>
This link will expire in
<strong>10 minutes.</strong>
</p>

<p>
If you didn't request a password reset, you can safely ignore this email.
</p>

<hr>

<p style="font-size:13px;color:#777;">
If the button doesn't work, copy and paste the link below into your browser:
</p>

<p style="word-break:break-all;color:#2563eb;">
${resetURL}
</p>

</div>

</body>
</html>
`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message,
      html,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({
      validateBeforeSave: false,
    });

    throw new AppError(
      "There was an error sending the password reset email. Please try again later.",
      500,
    );
  }

  // 5. For now, return the token for testing in development. In production, send it via email.
  const response = {
    message:
      "If an account with that email exists, a password reset email has been sent..",
  };

  // DEVELOPMENT ONLY
  if (process.env.NODE_ENV === "development") {
    response.resetToken = resetToken;
  }

  return response;
};

// RESET PASSWORD
const resetPassword = async (resetToken, newPassword) => {
  // 1. Hash the token received from the user
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // 2. Find the user using the hashed token
  // 3. Make sure the token has not expired
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  }).select("+password");

  // 4. If no user is found, the token is invalid or expired
  if (!user) {
    throw new AppError("Password reset token is invalid or has expired.", 400);
  }

  // 5. Update the user's password
  user.password = newPassword;

  // 6. Update passwordChangedAt
  user.passwordChangedAt = new Date();

  // 7. Remove the reset token so it cannot be reused
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // 8. Save the user
  // This will trigger the pre-save middleware
  // and hash the new password
  await user.save();

  // 9. Generate a new JWT token
  const token = generateToken(user._id, user.role);

  // 10. Remove password from response
  user.password = undefined;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  return {
    user,
  };
};

module.exports = {
  // signup,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
};
