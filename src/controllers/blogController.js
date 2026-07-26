// Mirrors com.ngoportal.backend.controller.BlogController
const blogService = require("../services/blogService");
const catchAsync = require("../utils/catchAsync");

const getAll = catchAsync(async (req, res) => {
  const blogs = await blogService.getAll();
  res.json(blogs);
});

const getById = catchAsync(async (req, res) => {
  const blog = await blogService.getById(req.params.id);
  res.json(blog);
});

const create = catchAsync(async (req, res) => {
  const blog = await blogService.create(req.body, req.user);
  res.json(blog);
});

const update = catchAsync(async (req, res) => {
  const blog = await blogService.update(req.params.id, req.body);
  res.json(blog);
});

const remove = catchAsync(async (req, res) => {
  await blogService.remove(req.params.id);
  res.status(200).send();
});

module.exports = { getAll, getById, create, update, remove };
