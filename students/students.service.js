const studentsModel = require("./students.model");

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
  studentId,
}) => {
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
  });

  return {
    code: 201,
    message: "Student created successfully",
    data: student,
  };
};

// Bulk create students function to create multiple student records at once
const createBulkStudents = async (students) => {
  const createdStudents = await studentsModel.insertMany(students);

  return {
    code: 201,
    message: "Students created successfully",
    data: createdStudents,
  };
};

// The updateStudents function updates an existing student record based on the provided ID and new data
const updateStudents = async (id, updateData) => {
  const student = await studentsModel.findById(id);

  if (!student) {
    return {
      code: 404,
      message: "Student not found",
      data: null,
    };
  }

  const allowedFields = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "dateOfBirth",
    "gender",
    "department",
    "level",
    "studentId",
  ];

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      student[field] = updateData[field];
    }
  });

  await student.save();

  return {
    code: 200,
    message: "Student updated successfully",
    data: student,
  };
};

// The deleteStudent function deletes a student record from the database based on the provided ID
const deleteStudent = async (id) => {
  const student = await studentsModel.deleteOne({ _id: id });

  if (!student) {
    return {
      code: 404,
      message: "Student not found",
      data: null,
    };
  }

  return {
    code: 200,
    message: "Student deleted successfully",
    data: null,
  };
};

// The getStudent function retrieves a student record from the database based on the provided ID
const getStudent = async (id) => {
  const student = await studentsModel.findById(id);

  if (!student) {
    return {
      code: 404,
      message: "Student not found",
    };
  }

  return {
    code: 200,
    message: "Student retrieved Successfully",
    data: student,
  };
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

  const students = await studentsModel
    .find(query)
    .skip(skip)
    .limit(Number(limit));

  const total = await studentsModel.countDocuments(query);

  return {
    code: 200,
    message: "Students retrieved successfully",
    data: {
      students,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    },
  };
};

module.exports = {
  createStudent,
  createBulkStudents,
  updateStudents,
  deleteStudent,
  getStudent,
  getAllStudents,
};
