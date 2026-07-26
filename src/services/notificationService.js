// Mirrors com.ngoportal.backend.service.NotificationService
const Notification = require("../models/Notification");
const ApiException = require("../utils/ApiException");

// Called whenever a blog is published so every user sees a "new post" notification
async function createNewBlogNotification(blog) {
  const notification = new Notification({
    type: "NEW_BLOG",
    blogId: blog.id || blog._id.toString(),
    title: `New blog post: ${blog.title}`,
    message: `${blog.authorName} published a new session blog. Tap to read it.`,
  });
  await notification.save();
}

// Mirrors NotificationView -- the frontend only needs the notification content
// plus whether THIS user has read it (readBy is never exposed as a raw array).
async function getForUser(userId) {
  const all = await Notification.find().sort({ createdAt: -1 });
  return all.map((n) => ({
    id: n._id.toString(),
    type: n.type,
    blogId: n.blogId,
    title: n.title,
    message: n.message,
    createdAt: n.createdAt,
    read: n.readBy.includes(userId),
  }));
}

async function getUnreadCount(userId) {
  const all = await Notification.find();
  return all.filter((n) => !n.readBy.includes(userId)).length;
}

async function markAsRead(notificationId, userId) {
  const notification = await Notification.findById(notificationId).catch(() => null);
  if (!notification) {
    throw new ApiException("Notification not found", 404);
  }
  if (!notification.readBy.includes(userId)) {
    notification.readBy.push(userId);
    await notification.save();
  }
}

async function markAllAsRead(userId) {
  const all = await Notification.find();
  await Promise.all(
    all.map((n) => {
      if (!n.readBy.includes(userId)) {
        n.readBy.push(userId);
        return n.save();
      }
      return Promise.resolve();
    })
  );
}

module.exports = { createNewBlogNotification, getForUser, getUnreadCount, markAsRead, markAllAsRead };
