const mongoose = require("mongoose");

async function connectDB() {
  // readyState 1 = connected, 2 = connecting — skip if already handled
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    return;
  }
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");
}

module.exports = connectDB;