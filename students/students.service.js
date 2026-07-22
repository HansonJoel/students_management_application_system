const studentsModel = require("./students.model");
const generateStudentId = require("../utils/generateStudentId");
const AppError = require("../utils/AppError");
// Service functions for managing students
// These functions interact with the studentsModel to perform CRUD operations
// Each function returns an object containing a status code, a message, and the relevant data

// The createStudent function creates a new student record in the database
const createStudent = async ({
  firstName,
  lastName,
  email,
  phone,
  dateOfBirth,
  gender,
  department,
  level,
  password,
}) => {
  // Check if email already exists
  const existingStudent = await studentsModel.findOne({ email });

  if (existingStudent) {
    throw new AppError("Email already exists", 409);
  }
  // Generate student ID based on department and current year
  const studentId = await generateStudentId(department);

  const student = await studentsModel.create({
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

  return student;
};

// ===============================
// Bulk Create Students (Admin)
// ===============================
const createBulkStudents = async (students) => {
  const studentsWithIds = await Promise.all(
    students.map(async (student) => ({
      ...student,
      studentId: await generateStudentId(student.department),
      role: "student",
    })),
  );

  return await studentsModel.insertMany(studentsWithIds);
};

// The updateStudent function updates an existing student record based on the provided ID and new data
const updateStudent = async (id, updateData) => {
  const student = await studentsModel.findById(id);

  if (!student) {
    throw new AppError("Student not found", 404);
  }

  const allowedFields = [
    "firstName",
    "lastName",
    "phone",
    "dateOfBirth",
    "gender",
    "department",
    "level",
  ];

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      student[field] = updateData[field];
    }
  });

  await student.save();

  return student;
};

// The deleteStudent function deletes a student record from the database based on the provided ID
const deleteStudent = async (id) => {
  const student = await studentsModel.findByIdAndDelete(id);

  if (!student) {
    throw new AppError("Student not found", 404);
  }

  return student;
};

// The getStudent function retrieves a student record from the database based on the provided ID
const getStudent = async (id) => {
  const student = await studentsModel.findById(id);

  if (!student) {
    throw new AppError("Student not found", 404);
  }

  return student;
};

// The getAllStudents function retrieves all student records
const getAllStudents = async ({
  firstName,
  lastName,
  email,
  gender,
  department,
  level,
  limit = 10,
  page = 1,
} = {}) => {
  // Convert pagination values to numbers and validate them
  page = Math.max(1, Number(page) || 1);
  limit = Math.max(1, Number(limit) || 10);

  // Query builder pattern
  const query = {};

  if (firstName) {
    query.firstName = {
      $regex: firstName,
      $options: "i",
    };
  }

  if (lastName) {
    query.lastName = {
      $regex: lastName,
      $options: "i",
    };
  }

  if (email) {
    query.email = email;
  }

  if (gender) {
    query.gender = gender;
  }

  if (department) {
    query.department = department;
  }

  if (level) {
    query.level = level;
  }

  // Pagination
  const skip = (page - 1) * limit;

  // Retrieve students
  const students = await studentsModel
    .find(query)
    .sort({ createdAt: -1 }) // newest first
    .skip(skip)
    .limit(limit);

  // Count matching documents
  const total = await studentsModel.countDocuments(query);

  return {
    students,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};
module.exports = {
  createStudent,
  createBulkStudents,
  updateStudent,
  deleteStudent,
  getStudent,
  getAllStudents,
};
