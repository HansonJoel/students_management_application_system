const studentsModel = require("./students.model");

// Service functions for managing students
// These functions interact with the studentsModel to perform CRUD operations
// Each function returns an object containing a status code, a message, and the relevant data

// The createStudent function creates a new student record in the database
const createStudent = async ({ name, age, gender }) => {
  const student = await studentsModel.create({ name, age, gender });

  return {
    code: 201,
    message: "Student created successfully",
    data: student,
  };
};

// The updateStudents function updates an existing student record based on the provided ID and new data
const updateStudents = async (id, { name, age, gender }) => {
  const student = await studentsModel.findById(id);

  if (!student) {
    return {
      code: 404,
      message: "Student not found",
      data: null,
    };
  }

  if (!name && !age && !gender) {
    return {
      code: 400,
      message: "Invalid input: name, age, and gender are required",
    };
  }

  if (name) student.name = name;
  if (age) student.age = age;
  if (gender) student.gender = gender;

  // const allowedFields = ["name", "age", "gender"];

  // allowedFields.forEach((field) => {
  //   if (updateData[field] !== undefined) {
  //     student[field] = updateData[field];
  //   }
  // });

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

// The getAllStudent function retrieves all student record from the database
const getAllStudents = async ({
  name,
  age,
  gender,
  limit = 10,
  page = 1,
} = {}) => {
  // builder pattern, build query
  const query = {};

  if (name) {
    query.name = { $regex: name, $options: "i" };
  }
  if (age) query.age = age;
  if (gender) query.gender = gender;

  // pagination
  const skip = (page - 1) * limit;

  const student = await studentsModel.find(query).skip(skip).limit(limit);
  const total = await studentsModel.countDocuments(query);

  return {
    code: 200,
    message: "Students retrieved Successfully",
    data: {
      student,
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
  updateStudents,
  deleteStudent,
  getStudent,
  getAllStudents,
};
