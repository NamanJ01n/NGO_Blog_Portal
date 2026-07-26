// Mirrors com.ngoportal.backend.model.Comment
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  blogId: { type: String, required: true },
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  text: { type: String, required: true },

  // Admin's reply to this comment, if any
  adminReply: { type: String, default: null },
  repliedByName: { type: String, default: null },
  repliedById: { type: String, default: null },
  repliedAt: { type: Date, default: null },

  createdAt: { type: Date, default: Date.now },
});

commentSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    // Mirrors Comment.isReplied() -- a computed field, not stored
    ret.replied = !!(ret.adminReply && ret.adminReply.trim().length > 0);
    return ret;
  },
});

module.exports = mongoose.model("Comment", commentSchema);
