// Mirrors com.ngoportal.backend.security.JwtUtil
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;
const EXPIRATION_MS = parseInt(process.env.JWT_EXPIRATION_MS || "86400000", 10); // default 24h

function generateToken(email, role) {
  return jwt.sign(
    { role },
    SECRET,
    {
      subject: email,
      expiresIn: Math.floor(EXPIRATION_MS / 1000), // jsonwebtoken expects seconds
    }
  );
}

// Returns the decoded payload if the token is valid (correct signature, not expired),
// or throws if it isn't -- mirrors JwtUtil's extractEmail/extractRole/isTokenValid
// (jwt.verify already enforces the expiry check that isTokenValid did manually).
function verifyToken(token) {
  return jwt.verify(token, SECRET); // payload.sub = email, payload.role = role
}

module.exports = { generateToken, verifyToken };
