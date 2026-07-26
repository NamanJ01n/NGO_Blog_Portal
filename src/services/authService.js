// Mirrors com.ngoportal.backend.service.AuthService
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");
const ApiException = require("../utils/ApiException");
const { generateToken } = require("../utils/jwt");
const emailService = require("./emailService");

const SALT_ROUNDS = 10;

// Student self-registration
async function registerStudent({ name, email, password }) {
  return createUnverifiedUser(name, email, password, "STUDENT");
}

// Only an existing admin can create another admin (called from a protected route)
async function createAdmin({ name, email, password }) {
  return createUnverifiedUser(name, email, password, "ADMIN");
}

async function createUnverifiedUser(name, email, rawPassword, role) {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiException("An account with this email already exists", 409);
  }

  const token = uuidv4();
  const hashedPassword = await bcrypt.hash(rawPassword, SALT_ROUNDS);

  const user = new User({
    name,
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    role,
    verified: false,
    verificationToken: token,
    // Extended to 7 days -- kept exactly as the Java version has it locally,
    // even though the email text below still says "24 hours".
    verificationTokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  await user.save();
  await emailService.sendVerificationEmail(user.email, user.name, token);

  return `Registration successful. Please check your email (${user.email}) to verify your account.`;
}

async function verifyEmail(token) {
  console.log("Attempting to verify email with token: " + token);

  const user = await User.findOne({ verificationToken: token });
  if (!user) {
    console.log("No user found with token: " + token);
    throw new ApiException("Invalid or expired verification link", 400);
  }

  console.log(
    "Found user: " + user.email +
    ", Token expiry: " + user.verificationTokenExpiry +
    ", Current time: " + new Date()
  );

  if (user.verificationTokenExpiry && user.verificationTokenExpiry < new Date()) {
    console.log("Token expired for user: " + user.email);
    throw new ApiException("Verification link has expired. Please register again or request a new link.", 400);
  }

  user.verified = true;
  user.verificationToken = null;
  user.verificationTokenExpiry = null;

  console.log("Before save - User verified status: " + user.verified);
  const savedUser = await user.save();
  console.log("After save - User verified status: " + savedUser.verified);
  console.log("Verification successful for: " + savedUser.email);

  return "Email verified successfully. You can now log in.";
}

async function login({ email, password }) {
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    throw new ApiException("Invalid email or password", 401);
  }

  const matches = await bcrypt.compare(password, user.password);
  if (!matches) {
    throw new ApiException("Invalid email or password", 401);
  }

  if (!user.verified) {
    throw new ApiException("Please verify your email before logging in", 403);
  }

  const token = generateToken(user.email, user.role);
  return { token, name: user.name, email: user.email, role: user.role };
}

async function forgotPassword(email) {
  const normalizedEmail = email.toLowerCase().trim();

  // Don't reveal whether the email exists -- always return the same message,
  // but only actually send an email if we found a matching account.
  const user = await User.findOne({ email: normalizedEmail });
  if (user) {
    const token = uuidv4();
    user.resetPasswordToken = token;
    user.resetPasswordTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();
    await emailService.sendPasswordResetEmail(user.email, user.name, token);
  }

  return `If an account exists for ${normalizedEmail}, a password reset link has been sent to it.`;
}

async function resetPassword(token, newPassword) {
  const user = await User.findOne({ resetPasswordToken: token });
  if (!user) {
    throw new ApiException("Invalid or expired reset link", 400);
  }

  if (!user.resetPasswordTokenExpiry || user.resetPasswordTokenExpiry < new Date()) {
    throw new ApiException("Reset link has expired. Please request a new one.", 400);
  }

  user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
  user.resetPasswordToken = null;
  user.resetPasswordTokenExpiry = null;
  await user.save();

  return "Password reset successfully. You can now log in with your new password.";
}

module.exports = {
  registerStudent,
  createAdmin,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
};
