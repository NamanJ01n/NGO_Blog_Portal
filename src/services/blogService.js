// Mirrors com.ngoportal.backend.service.BlogService
const Blog = require("../models/Blog");
const ApiException = require("../utils/ApiException");
const notificationService = require("./notificationService");

async function getAll() {
  return Blog.find().sort({ createdAt: -1 });
}

async function getById(id) {
  const blog = await Blog.findById(id).catch(() => null); // invalid ObjectId -> treat as not found
  if (!blog) {
    throw new ApiException("Blog not found", 404);
  }
  return blog;
}

async function create(request, author) {
  const blog = new Blog({
    title: request.title,
    content: request.content,
    sessionDate: request.sessionDate || null,
    pptLink: request.pptLink || null,
    youtubeLink: request.youtubeLink || null,
    instagramLink: request.instagramLink || null,
    authorId: author.id,
    authorName: author.name,
    authorEmail: author.email,
  });

  const saved = await blog.save();
  await notificationService.createNewBlogNotification(saved);
  return saved;
}

async function update(id, request) {
  const blog = await getById(id);
  blog.title = request.title;
  blog.content = request.content;
  blog.sessionDate = request.sessionDate || null;
  blog.pptLink = request.pptLink || null;
  blog.youtubeLink = request.youtubeLink || null;
  blog.instagramLink = request.instagramLink || null;
  blog.updatedAt = new Date();
  return blog.save();
}

async function remove(id) {
  const exists = await Blog.exists({ _id: id }).catch(() => null);
  if (!exists) {
    throw new ApiException("Blog not found", 404);
  }
  await Blog.deleteOne({ _id: id });
}

module.exports = { getAll, getById, create, update, remove };
