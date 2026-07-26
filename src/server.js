require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const seedAdmin = require("./seed/adminSeeder");

const PORT = process.env.PORT || 8080;

async function start() {
  await connectDB();
  await seedAdmin();

  app.listen(PORT, () => {
    console.log(`ngo-portal-backend (Node) started on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});