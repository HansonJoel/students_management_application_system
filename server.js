require("dotenv").config();
const app = require("./app");
const { connectDB } = require("./config/database");

const PORT = process.env.PORT || 3000;

// Async function to handle server startup
const startServer = async () => {
  try {
    // 1. Wait for database connection
    await connectDB();

    // 2. Start the Express server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1); // Exit process with failure code
  }
};

// Execute the startup function
startServer();
