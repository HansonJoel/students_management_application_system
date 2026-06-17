const studentService = require("./students.service");

// CREATE STUDENT
const createStudentController = async (req, res, next) => {
  try {
    const student = await studentService.createStudent(req.body);

    return res.status(201).json({
      message: "Student created Successfully",
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// CREATE BULK STUDENTS
const createBulkStudentsController = async (req, res, next) => {
  try {
    const students = await studentService.createBulkStudents(req.body);

    return res.status(201).json({
      message: "Students created Successfully",
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE STUDENT
const updateStudentController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await studentService.updateStudent(id, req.body);

    return res.status(200).json({
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

const deleteStudentController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await studentService.deleteStudent(id);

    return res.status(200).json({
      message: "Student deleted successfully",
      // data: student,
    });
  } catch (error) {
    next(error);
  }
};

const getStudentController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await studentService.getStudent(id);

    return res.status(200).json({
      message: "Student retrieved successfully",
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL STUDENTS
const getAllStudentsController = async (req, res, next) => {
  try {
    const data = await studentService.getAllStudents(req.query);

    return res.status(200).json({
      message: "Students retrieved successfully",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStudentController,
  createBulkStudentsController,
  updateStudentController,
  deleteStudentController,
  getStudentController,
  getAllStudentsController,
};
