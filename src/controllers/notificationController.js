// Mirrors com.ngoportal.backend.controller.NotificationController
const notificationService = require("../services/notificationService");
const catchAsync = require("../utils/catchAsync");

const list = catchAsync(async (req, res) => {
  const notifications = await notificationService.getForUser(req.user.id);
  res.json(notifications);
});

const unreadCount = catchAsync(async (req, res) => {
  const count = await notificationService.getUnreadCount(req.user.id);
  res.json({ count });
});

const markRead = catchAsync(async (req, res) => {
  await notificationService.markAsRead(req.params.id, req.user.id);
  res.json({ message: "Marked as read" });
});

const markAllRead = catchAsync(async (req, res) => {
  await notificationService.markAllAsRead(req.user.id);
  res.json({ message: "All notifications marked as read" });
});

module.exports = { list, unreadCount, markRead, markAllRead };
