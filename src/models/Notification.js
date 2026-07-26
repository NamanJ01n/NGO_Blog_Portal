// Mirrors com.ngoportal.backend.model.Notification
// A portal-wide notification (currently only used for "new blog published").
// Read state is tracked per-user via the readBy array rather than one row per user,
// since this is a small-scale NGO portal.
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  type: { type: String, default: "NEW_BLOG" },
  blogId: { type: String, default: null },
  title: { type: String, required: true },
  message: { type: String, required: true },
  readBy: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

notificationSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
