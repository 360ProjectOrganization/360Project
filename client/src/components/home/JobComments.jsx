import { useState, useEffect } from "react";
import { jobPostingApi } from "../../utils/api.js";
import Modal from "../common/Modal.jsx";
import Comment from "./Comment.jsx";


export default function JobComments({ jobId, ownerCompanyId, currentUserId, role, isAuthenticated }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [commentToDelete, setCommentToDelete] = useState(null);

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

    useEffect(() => {
        if (!jobId) return;

        fetchComments();

        const intervalId = setInterval(() => {
            fetchComments();
        }, 2000) // every 2 seconds

        return () => clearInterval(intervalId);
    }, [jobId]);

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

    async function handleDeleteConfirm() {
        const id = commentToDelete?._id;
        if (!jobId || !id) return;
        await jobPostingApi.deleteComment(jobId, id);
        await fetchComments();
        setCommentToDelete(null);
    }

    return (
        <section className="job-details-comments">
            <h3>Comments</h3>
            <div className="job-details-comments-list">
                {comments.map((c) => (
                    <Comment key={c._id} comment={c} currentUserId={currentUserId} role={role} isFromJobOwner={ownerCompanyId && String(c.authorId) === String(ownerCompanyId)} onSaveEdit={handleSaveEdit} onDeleteClick={(comment) => setCommentToDelete(comment)} />
                ))}
                {comments.length === 0 && <p>No comments yet.</p>}
            </div>
            {isAuthenticated && (role !== "company" || String(ownerCompanyId) === String(currentUserId)) && (
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

            <Modal isOpen={!!commentToDelete} onClose={() => setCommentToDelete(null)} title="Delete Comment" size="small">
                {commentToDelete && (
                    <div className="delete-modal-content">
                        <p>Are you sure you want to delete this comment?</p>
                        <div className="modal-actions">
                            <button className="form-action-btn" type="button" onClick={() => setCommentToDelete(null)}>Cancel</button>
                            <button className="form-action-btn" type="button" onClick={handleDeleteConfirm}>Confirm</button>
                        </div>
                    </div>
                )}
            </Modal>
        </section>
    );
}