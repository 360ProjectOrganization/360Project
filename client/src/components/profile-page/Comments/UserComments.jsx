import { useEffect, useState } from "react";
import { jobPostingApi } from "../../../utils/api";
import CommentsCard from "./CommentsCard";
import "./Comments.css";
import Modal from "../../common/Modal";

export default function UserComments() {
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [commentToDelete, setCommentToDelete] = useState(null);

    async function fetchComments() {
        try {
            setLoading(true);
            const data = await jobPostingApi.getMyComments();
            setComments(Array.isArray(data) ? data : []);
        }
        catch (err) {
            console.error("Failed to fetch comments:", err);
            setComments([]);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchComments();
    }, []);

    async function handleSaveEdit(commentId, jobId, updatedContent) {
        if (!commentId || !jobId || !updatedContent?.trim()) return;

        setLoading(true);
        try {
            await jobPostingApi.updateComment(jobId, commentId, updatedContent.trim());
            await fetchComments();
        }
        catch (err) {
            console.error("Failed to update comment:", err);
        }
        finally {
            setLoading(false);
        }
    }

    async function handleDeleteConfirm() {
        const id = commentToDelete?._id;
        const jobId = commentToDelete?.jobId;

        if (!id || !jobId) return;

        setLoading(true);
        try {
            await jobPostingApi.deleteComment(jobId, id);
            await fetchComments();
            setCommentToDelete(null);
        }
        catch (err) {
            console.error("Failed to delete comment:", err);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <section className="comments-container">
            <h2>My Comments</h2>

            <div className="comments-list">
                {loading && <p>Loading...</p>}

                {!loading && comments.length === 0 && <p>No comments yet.</p>}

                {!loading && comments.map((c) => (
                    <CommentsCard
                        key={c._id}
                        comment={c}
                        onSaveEdit={handleSaveEdit}
                        onDeleteClick={(comment) => setCommentToDelete(comment)}
                    />
                ))}
            </div>

            <Modal isOpen={!!commentToDelete} onClose={() => setCommentToDelete(null)} title="Delete Comment" size="small">
                {commentToDelete && (
                    <div className="delete-modal-content">
                        <p>Are you sure you want to delete this comment?</p>
                        <div className="modal-actions">
                            <button className="delete-btn" onClick={() => setCommentToDelete(null)}>Cancel</button>
                            <button className="delete-btn" onClick={handleDeleteConfirm} disabled={loading}>Confirm</button>
                        </div>
                    </div>
                )}
            </Modal>
        </section>
    )
}