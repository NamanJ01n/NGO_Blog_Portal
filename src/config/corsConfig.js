// Mirrors com.ngoportal.backend.config.CorsConfig
// In production, add your deployed frontend URL to this list.
const corsOptions = {
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["*"],
  credentials: true,
};

module.exports = corsOptions;
