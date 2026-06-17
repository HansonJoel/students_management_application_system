const studentService = require("./students.service");

// CREATE STUDENT
const createStudentController = async (req, res, next) => {
  try {
    const response = await studentService.createStudent(req.body);

    return res.status(response.code).json({
      message: response.message,
      data: response.data,
    });
  } catch (error) {
    next(error);
  }
};

// CREATE BULK STUDENTS
const createBulkStudentsController = async (req, res, next) => {
  try {
    const response = await studentService.createBulkStudents(req.body);

    return res.status(response.code).json({
      message: response.message,
      data: response.data,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE STUDENT
const updateStudentController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await studentService.updateStudents(id, req.body);

    return res.status(response.code).json({
      message: response.message,
      data: response.data,
    });
  } catch (error) {
    next(error);
  }
};

const deleteStudentController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await studentService.deleteStudent(id);

    return res.status(response.code).json({
      message: response.message,
      data: response.data,
    });
  } catch (error) {
    next(error);
  }
};

const getStudentController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await studentService.getStudent(id);

    return res.status(response.code).json({
      message: response.message,
      data: response.data,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL STUDENTS
const getAllStudentsController = async (req, res, next) => {
  try {
    const response = await studentService.getAllStudents(req.query);

    return res.status(response.code).json({
      message: response.message,
      data: response.data,
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
