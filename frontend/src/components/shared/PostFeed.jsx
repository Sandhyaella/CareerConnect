import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { createPost, deletePost, getPosts } from "../../services/postService";
import LoadingSpinner from "../shared/LoadingSpinner";

const PostFeed = () => {
  const { user, socket } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadPosts = async () => {
    try {
      const data = await getPosts({ limit: 20 });
      setPosts(data.posts);
    } catch (error) {
      toast.error(String(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const onNew = (post) => setPosts((prev) => (prev.some((p) => p._id === post._id) ? prev : [post, ...prev]));
    const onDeleted = ({ postId }) => setPosts((prev) => prev.filter((p) => p._id !== postId));
    socket.on("post:new", onNew);
    socket.on("post:deleted", onDeleted);
    return () => {
      socket.off("post:new", onNew);
      socket.off("post:deleted", onDeleted);
    };
  }, [socket]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to create a post");
    setSubmitting(true);
    try {
      await createPost({ type, description });
      setType("");
      setDescription("");
      toast.success("Post published");
      await loadPosts();
    } catch (error) {
      toast.error(String(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
      toast.success("Post deleted");
    } catch (error) {
      toast.error(String(error));
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });

  return (
    <div className="container py-4 post-feed-page">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="mb-4">
            <h2 className="mb-1">Community Feed</h2>
            <p className="text-muted mb-0">Share updates, insights, and opportunities with the CareerConnect community.</p>
          </div>

          {user && (
            <form className="card border-0 p-4 mb-4 post-create-card" onSubmit={handleSubmit}>
              <h5 className="mb-3">Create a Post</h5>
              <div className="mb-3">
                <label className="form-label profile-label" htmlFor="post-type">Post Type</label>
                <input
                  id="post-type"
                  className="form-control"
                  placeholder="e.g. Job Tip, Hiring Update, Career Advice, Announcement"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label profile-label" htmlFor="post-description">Description</label>
                <textarea
                  id="post-description"
                  className="form-control"
                  rows={4}
                  placeholder="Write your post description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? "Publishing..." : "Publish Post"}
              </button>
            </form>
          )}

          {!user && (
            <div className="alert alert-info border-0 mb-4">
              Login as a candidate or recruiter to publish posts.
            </div>
          )}

          {loading ? (
            <LoadingSpinner />
          ) : posts.length === 0 ? (
            <div className="card border-0 p-4 text-center text-muted">No posts yet. Be the first to share something.</div>
          ) : (
            posts.map((post) => {
              const authorId = post.author?._id || post.author;
              const isOwner = user && String(authorId) === String(user._id || user.id);
              return (
                <article className="card border-0 p-4 mb-3 post-card" key={post._id}>
                  <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                    <div>
                      <span className={`profile-role-badge profile-role-${post.author?.role}`}>
                        {post.author?.role || "user"}
                      </span>
                      <h5 className="mt-2 mb-1">{post.type}</h5>
                      <div className="post-meta">
                        {post.author?.name} · {formatDate(post.createdAt)}
                      </div>
                    </div>
                    {isOwner && (
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(post._id)}>
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="post-description mb-0">{post.description}</p>
                </article>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default PostFeed;
