require("dotenv").config();
const app = require("./app");
const { connectDB } = require("./config/database");

const PORT = process.env.PORT || 3000;

// ===============================
// Handle uncaught exceptions
// ===============================

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION 💥");
  console.log(err.name, err.message);
  process.exit(1);
});

// Async function to handle server startup
const startServer = async () => {
  try {
    // 1. Wait for database connection
    await connectDB();

    // 2. Start the Express server
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    // ===============================
    // Handle unhandled promise rejection
    // ===============================

    process.on("unhandledRejection", (err) => {
      console.log("UNHANDLED REJECTION 💥");
      console.log(err.name, err.message);

      server.close(() => {
        process.exit(1);
      });
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1); // Exit process with failure code
  }
};

// Execute the startup function
startServer();
