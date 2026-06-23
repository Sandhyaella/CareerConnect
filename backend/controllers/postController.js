import Post from "../models/Post.js";
import { getIo } from "../utils/socket.js";

// GET /api/posts
// Returns a paginated, most-recent-first feed of all posts, regardless of author.
// Public community feed -- not scoped to the logged-in user.
export const getPosts = async (req, res) => {
  // Defaults: page 1, 10 posts per page, if not provided in the query string
  const { page = 1, limit = 10 } = req.query;

  // Calculate how many documents to skip to land on the requested page.
  // e.g. page=3, limit=10 -> skip the first 20 documents
  const skip = (Number(page) - 1) * Number(limit);

  // Run the page-of-posts query and the total-count query CONCURRENTLY with
  // Promise.all, since neither query depends on the other's result --
  // this is faster than awaiting them one after another.
  const [posts, total] = await Promise.all([
    Post.find()
      .populate("author", "name email role") // attach author's public info
      .sort({ createdAt: -1 }) // newest posts first
      .skip(skip)
      .limit(Number(limit)),
    Post.countDocuments() // total post count, used to calculate total pages
  ]);

  res.json({
    posts,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)) // total number of pages available
  });
};

// POST /api/posts
// Creates a new post authored by the logged-in user, then broadcasts it
// live to every connected client so feeds update without a refresh.
export const createPost = async (req, res) => {
  const { type, description } = req.body;

  // Validate both fields are present and not just whitespace
  if (!type?.trim() || !description?.trim()) {
    return res.status(400).json({ message: "Type and description are required" });
  }

  const post = await Post.create({
    author: req.user._id, // taken from the authenticated user, never trusted from req.body
    type: type.trim(),
    description: description.trim()
  });

  // Attach author info before sending back / broadcasting
  const populated = await post.populate("author", "name email role");

  const io = getIo();
  // Global broadcast (no specific room) -- every connected client sees new
  // posts appear live, since this is a public feed everyone should see,
  // unlike chat messages which are private to specific participants.
  io?.emit("post:new", populated);

  return res.status(201).json(populated);
};

// DELETE /api/posts/:id
// Deletes a post -- only the original author is allowed to do this.
export const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  // Ownership check: compare the post's author to the logged-in user.
  // String(...) on both sides since post.author is an ObjectId, not a string.
  if (String(post.author) !== String(req.user._id)) {
    return res.status(403).json({ message: "Not allowed to delete this post" });
  }

  await Post.findByIdAndDelete(req.params.id);

  const io = getIo();
  // Tell every connected client this post is gone, so it can be removed
  // from everyone's feed in real time without needing a manual refresh.
  io?.emit("post:deleted", { postId: req.params.id });

  return res.json({ message: "Post deleted" });
};