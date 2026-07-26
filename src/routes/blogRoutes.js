// Mirrors BlogController + CommentController's /api/blogs/** mappings, and the
// exact access rules from SecurityConfig (comment routes matched before the
// generic blog CRUD rules, so POST .../comments never gets swallowed by the
// admin-only "POST /api/blogs/**" rule).
const express = require("express");
const router = express.Router();

const { requireAuth, requireAdmin } = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");
const { blogValidators } = require("../validators/blogValidators");
const { commentValidators, replyValidators } = require("../validators/commentValidators");

const blogController = require("../controllers/blogController");
const commentController = require("../controllers/commentController");

// --- comments (must come before the generic "/:id" blog routes below) ---
router.get("/:id/comments", requireAuth, commentController.getComments);
router.post("/:id/comments", requireAuth, commentValidators, validateRequest, commentController.addComment);
router.put(
  "/:id/comments/:commentId/reply",
  requireAdmin,
  replyValidators,
  validateRequest,
  commentController.replyToComment
);

// --- blogs ---
router.get("/", requireAuth, blogController.getAll);
router.get("/:id", requireAuth, blogController.getById);
router.post("/", requireAdmin, blogValidators, validateRequest, blogController.create);
router.put("/:id", requireAdmin, blogValidators, validateRequest, blogController.update);
router.delete("/:id", requireAdmin, blogController.remove);

module.exports = router;
