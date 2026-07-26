// Mirrors com.ngoportal.backend.config.AdminSeeder
// Creates the very first admin account on startup, since "admin creates admin"
// needs at least one admin to already exist. Only runs if:
//   - no admin currently exists in the DB, and
//   - SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD env vars are set.
// The seeded admin is created already verified so they can log in immediately.
const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function seedAdmin() {
  const anyAdminExists = await User.exists({ role: "ADMIN" });

  const seedEmail = process.env.SEED_ADMIN_EMAIL;
  const seedPassword = process.env.SEED_ADMIN_PASSWORD;

  if (anyAdminExists || !seedEmail || !seedEmail.trim() || !seedPassword || !seedPassword.trim()) {
    return;
  }

  const admin = new User({
    name: process.env.SEED_ADMIN_NAME || "Super Admin",
    email: seedEmail.toLowerCase().trim(),
    password: await bcrypt.hash(seedPassword, 10),
    role: "ADMIN",
    verified: true, // seeded admin skips email verification
  });

  await admin.save();
  console.log("Seeded first admin account: " + seedEmail);
}

module.exports = seedAdmin;
