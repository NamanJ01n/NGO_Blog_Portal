// Mirrors com.ngoportal.backend.service.CommentService
const Comment = require("../models/Comment");
const ApiException = require("../utils/ApiException");
const blogService = require("./blogService");
const emailService = require("./emailService");

async function getByBlog(blogId) {
  return Comment.find({ blogId }).sort({ createdAt: 1 });
}

async function addComment(blogId, request, student) {
  const blog = await blogService.getById(blogId); // throws 404 if the blog doesn't exist

  const comment = new Comment({
    blogId,
    studentId: student.id,
    studentName: student.name,
    studentEmail: student.email,
    text: request.text,
  });

  const saved = await comment.save();

  // Notify the blog author by email that a new question came in
  await emailService.sendNewCommentNotification(
    blog.authorEmail,
    blog.authorName,
    blog.title,
    student.name,
    request.text,
    blogId
  );

  return saved;
}

async function addReply(commentId, request, admin) {
  const comment = await Comment.findById(commentId).catch(() => null);
  if (!comment) {
    throw new ApiException("Comment not found", 404);
  }

  comment.adminReply = request.text;
  comment.repliedByName = admin.name;
  comment.repliedById = admin.id;
  comment.repliedAt = new Date();

  const saved = await comment.save();

  // Let the student know their question got an answer
  await emailService.sendCommentReplyNotification(
    comment.studentEmail,
    comment.studentName,
    admin.name,
    request.text,
    comment.blogId
  );

  return saved;
}

module.exports = { getByBlog, addComment, addReply };
