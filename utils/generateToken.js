const jwt = require("jsonwebtoken");

// Generating a JWT token for user
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
    issuer: "Joel Hanson", // Optional: specify the issuer of the token
  });
};

module.exports = generateToken;
