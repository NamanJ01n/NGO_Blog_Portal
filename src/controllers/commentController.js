// Mirrors com.ngoportal.backend.controller.CommentController
const commentService = require("../services/commentService");
const catchAsync = require("../utils/catchAsync");

const getComments = catchAsync(async (req, res) => {
  const comments = await commentService.getByBlog(req.params.id);
  res.json(comments);
});

const addComment = catchAsync(async (req, res) => {
  const comment = await commentService.addComment(req.params.id, req.body, req.user);
  res.json(comment);
});

// Admin-only, enforced by the requireAdmin middleware on this route
const replyToComment = catchAsync(async (req, res) => {
  const comment = await commentService.addReply(req.params.commentId, req.body, req.user);
  res.json(comment);
});

module.exports = { getComments, addComment, replyToComment };
