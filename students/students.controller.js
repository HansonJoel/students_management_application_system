const studentService = require("./students.service");

const createStudentController = async (req, res) => {
  const bodyOfRequest = req.body;

  const response = await studentService.createStudent({
    name: bodyOfRequest.name,
    age: bodyOfRequest.age,
    gender: bodyOfRequest.gender,
  });

  return res.status(response.code).json({
    message: response.message,
    data: response.data,
  });
};

const updateStudentController = async (req, res) => {
  const { id } = req.params;

  const response = await studentService.updateStudents(id, req.body);

  return res.status(response.code).json({
    message: response.message,
    data: response.data,
  });
};

const deleteStudentController = async (req, res) => {
  const { id } = req.params;
  const response = await studentService.deleteStudent(id);

  return res.status(response.code).json({
    message: response.message,
    data: response.data,
  });
};

const getStudentController = async (req, res) => {
  const { id } = req.params;
  const response = await studentService.getStudent(id);

  return res.status(response.code).json({
    message: response.message,
    data: response.data,
  });
};

const getAllStudentsController = async (req, res) => {
  const response = await studentService.getAllStudents();

  return res.status(response.code).json({
    message: response.message,
    data: response.data,
  });
};

module.exports = {
  createStudentController,
  updateStudentController,
  deleteStudentController,
  getStudentController,
  getAllStudentsController,
};
