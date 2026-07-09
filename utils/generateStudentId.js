const departmentCodes = require("../config/departments");
const Student = require("../students/students.model");
const AppError = require("./AppError");

const generateStudentId = async (department) => {
  // Get department code
  const departmentCode = departmentCodes[department];

  // Validate department
  if (!departmentCode) {
    throw new AppError(
      `Invalid department '${department}'. Unable to generate Student ID.`,
      400,
    );
  }

  // Current admission year
  const year = new Date().getFullYear();

  // Prefix e.g. CSC/2026/
  const prefix = `${departmentCode}/${year}/`;

  // Find the latest student in the same department and year
  const lastStudent = await Student.findOne({
    studentId: {
      $regex: `^${prefix}`,
    },
  }).sort({ studentId: -1 });

  let sequence = 1;

  if (lastStudent) {
    const lastSequence = parseInt(lastStudent.studentId.split("/")[2], 10);

    sequence = lastSequence + 1;
  }

  // Pad with leading zeros
  const formattedSequence = String(sequence).padStart(3, "0");

  return `${prefix}${formattedSequence}`;
};

module.exports = generateStudentId;
