const mongoose = require("mongoose");
const departmentCodes = require("../config/departments");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const studentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
      required: [true, "Email is required"],
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },

    department: {
      type: String,
      enum: Object.keys(departmentCodes),
      required: function () {
        return this.role === "student";
      },
    },

    level: {
      type: String,
      enum: ["100", "200", "300", "400", "500"],
      required: function () {
        return this.role === "student";
      },
    },

    // Student ID is only applicable to students.
    // It is unique when it exists.
    studentId: {
      type: String,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    role: {
      type: String,
      enum: ["student", "admin", "superAdmin"],
      default: "student",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  },
);

// =========================================
// INDEXES
// =========================================

// Student ID must be unique when it exists.
// Admins and Super Admins don't need a studentId.
studentSchema.index(
  { studentId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      studentId: { $exists: true, $ne: null },
    },
  },
);

// Hashing the password before saving it to the database
studentSchema.pre("save", async function () {
  // skip hashing if password is not modified
  if (!this.isModified("password")) return;

  // hashing the password before saving it to the database
  const saltRounds = Number(process.env.BCRYPT_SALT) || 12;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

// Middleware to filter out inactive users from query results
// studentSchema.pre(/^find/, async function () {
//   this.find({ isActive: true });
// });

studentSchema.pre(/^find/, function () {
  if (this.getOptions().includeInactive) {
    return;
  }

  this.find({ isActive: true });
});

// Method to compare the provided password with the stored hashed password
studentSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to check if the password has been changed after the token was issued
studentSchema.methods.isPasswordChanged = function (tokenIssuedAt) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return tokenIssuedAt < changedTimestamp;
  }

  return false;
};

// Generate a password reset token
studentSchema.methods.createPasswordResetToken = function () {
  // Generate a random token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash the token before storing it in the database
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Token expires in 10 minutes
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  // Return the unhashed token
  return resetToken;
};
module.exports = mongoose.model("Student", studentSchema);
