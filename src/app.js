const express = require("express");
const cors = require("cors");

const corsOptions = require("./config/corsConfig");
const connectDB = require("./config/db");
const seedAdmin = require("./seed/adminSeeder");
const { authenticate } = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

let seeded = false;

// Ensures a DB connection (and, once, the first admin) exist before
// handling any request. Cheap no-op on repeat calls -- needed because
// Vercel runs this file directly without server.js's startup flow.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    if (!seeded) {
      await seedAdmin();
      seeded = true;
    }
    next();
  } catch (err) {
    next(err);
  }
});

app.use(cors(corsOptions));
app.use(express.json());

app.use(authenticate);

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(errorHandler);

module.exports = app;