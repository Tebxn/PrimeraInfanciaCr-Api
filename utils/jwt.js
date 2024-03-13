const jwt = require('jsonwebtoken');

async function generateJWT(payload) {
    try {
        console.log(payload);
      return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
      });
    } catch (error) {
      throw new Error('Error generating JWT: ' + error.message);
    }
}

async function verifyJWT(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Error verifying JWT: ' + error.message);
    }
}

module.exports = { generateJWT, verifyJWT };
