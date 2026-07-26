// Mirrors NotificationController -- any logged-in user, matching
// SecurityConfig's ".requestMatchers(\"/api/notifications/**\").authenticated()"
const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middleware/auth");
const notificationController = require("../controllers/notificationController");

router.get("/", requireAuth, notificationController.list);
router.get("/unread-count", requireAuth, notificationController.unreadCount);
router.post("/:id/read", requireAuth, notificationController.markRead);
router.post("/read-all", requireAuth, notificationController.markAllRead);

module.exports = router;
