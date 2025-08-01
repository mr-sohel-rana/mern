const jwt = require("jsonwebtoken");

// Hardcoded JWT secret
const jwtSecret = "default-secret-key";  
const EncodeToken = (userId, name) => {
  try {
    const payload = {
      user_id: userId,
      name};

    // Generate a token with a 1-hour expiration
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
    return token;
  } catch (error) {
    console.error("Error encoding token:", error);
  }
};

 
const DecodeToken = (token) => {
  try {
    const decoded = jwt.verify(token, jwtSecret);
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
  }
};

module.exports = { EncodeToken, DecodeToken };
