import { useState, useEffect } from "react";
import { jobPostingApi } from "../../utils/api.js";
import Comment from "./Comment.jsx";


export default function JobComments({ jobId, ownerCompanyId, currentUserId, isAuthenticated }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newComment, setNewComment] = useState("");

    async function fetchComments() {
        if (!jobId) return;
        try {
            const data = await jobPostingApi.getComments(jobId);
            setComments(Array.isArray(data) ? data : []);
        }
        catch (err) {
            console.error("Failed to fetch comments:", err);
            setComments([]);
        }
    }

    useEffect(() => { fetchComments(); }, [jobId]);

    async function handleAddComment() {
        if (!isAuthenticated || !jobId || !newComment.trim()) return;
        setLoading(true);
        try {
            await jobPostingApi.addComment(jobId, { content: newComment.trim() });
            setNewComment("");
            await fetchComments();
        }
        catch (err) {
            console.error("Failed to add comment:", err);
        }
        finally {
            setLoading(false);
        }
    }

    async function handleSaveEdit(commentId, content) {
        if (!jobId) return;
        await jobPostingApi.updateComment(jobId, commentId, content);
        await fetchComments();
    }

    return (
        <section className="job-details-comments">
            <h3>Comments</h3>
            <div className="job-details-comments-list">
                {comments.map((c) => (
                    <Comment key={c._id} comment={c} currentUserId={currentUserId} isFromJobOwner={ownerCompanyId && String(c.authorId) === String(ownerCompanyId)} onSaveEdit={handleSaveEdit} />
                ))}
                {comments.length === 0 && <p>No comments yet.</p>}
            </div>
            {isAuthenticated && (
                <div className="add-comment-row">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        rows={2}
                        className="comment-input"
                    />
                    <button onClick={handleAddComment} disabled={loading || !newComment.trim()} className="job-details-add-comment-btn">Comment</button>
                </div>
            )}
        </section>
    );
}