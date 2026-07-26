// Mirrors com.ngoportal.backend.model.User
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true }, // bcrypt hash, never returned to client
  role: { type: String, enum: ["ADMIN", "STUDENT"], required: true },
  verified: { type: Boolean, default: false },
  verificationToken: { type: String, default: null },
  verificationTokenExpiry: { type: Date, default: null },
  resetPasswordToken: { type: String, default: null },
  resetPasswordTokenExpiry: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

// User is never serialized directly to a client response in this app (AuthResponse
// is used instead), but this transform exists as a safety net so the password hash
// can never leak if that ever changes.
userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);
