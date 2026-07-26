// Mirrors com.ngoportal.backend.model.Blog
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  sessionDate: { type: Date, default: null },
  pptLink: { type: String, default: null },
  youtubeLink: { type: String, default: null },
  instagramLink: { type: String, default: null },
  authorId: { type: String, required: true },
  authorName: { type: String, required: true },
  authorEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

blogSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Blog", blogSchema);
