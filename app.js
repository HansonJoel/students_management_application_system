const express = require("express");
const app = express();

// Middleware for parsing JSON bodies (highly recommended for POST/PATCH)
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Students Management Application System!");
});

// GET all students (Fixed: Added missing '/')
app.get("/v1/students", (req, res) => {
  res.send("Get all students");
});

// GET a specific student by ID (Fixed: Added missing '/')
app.get("/v1/students/:id", (req, res) => {
  res.send(`Get student with ID: ${req.params.id}`);
});

// CREATE a new student
app.post("/v1/students", (req, res) => {
  res.send("Student created successfully!");
});

// UPDATE a student by ID (Fixed: Added /:id parameter)
app.patch("/v1/students/:id", (req, res) => {
  res.send(`Student with ID: ${req.params.id} updated successfully!`);
});

// DELETE a student by ID (Fixed: Added /:id parameter)
app.delete("/v1/students/:id", (req, res) => {
  res.send(`Student with ID: ${req.params.id} deleted successfully!`);
});

// Export app so server.js can import it
module.exports = app;
