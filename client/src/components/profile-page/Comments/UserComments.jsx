import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jobPostingApi } from "../../../utils/api";
import CommentsCard from "./CommentsCard";
import "./Comments.css";
import Modal from "../../common/Modal";

export default function UserComments() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [jobToView, setJobToView] = useState(null);
    const [dateSort, setDateSort] = useState("newest");

    const sortedComments = [...comments].sort((a, b) => {
        const date1 = new Date(a.editedAt || a.createdAt);
        const date2 = new Date(b.editedAt || b.createdAt);
        return dateSort === "oldest" ? date1 - date2 : date2 - date1;
    });

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

    function confirmLeaveProfile() {
        if (!jobToView?.jobId) {
            setJobToView(null);
            return;
        }
        navigate("/", {
            state: { openPostingId: String(jobToView.jobId) },
        });
        setJobToView(null);
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
            <section className="comments-container-header">
                <h2>My Comments</h2>
                    <select className="comments-filter-select" value={dateSort} onChange={(e) => setDateSort(e.target.value)}>
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                    </select>

            </section>

            <div className="comments-list">
                {loading && <p>Loading...</p>}

                {!loading && comments.length === 0 && <p>No comments yet.</p>}

                {!loading && sortedComments.map((c) => (
                    <CommentsCard
                        key={c._id}
                        comment={c}
                        onSaveEdit={handleSaveEdit}
                        onDeleteClick={(comment) => setCommentToDelete(comment)}
                        onViewJobPost={(comment) => setJobToView(comment)}
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

            <Modal isOpen={!!jobToView} onClose={() => setJobToView(null)} title="Leave profile?" size="small">
                {jobToView && (
                    <div className="delete-modal-content">
                        <p>
                            You are about to leave your profile and view this job in the listings
                            {jobToView.jobTitle ? (
                                <>
                                    {" "}for <strong>{jobToView.jobTitle}</strong>
                                </>
                            ) : null}. Continue?
                        </p>
                        <div className="modal-actions">
                            <button type="button" className="delete-btn" onClick={() => setJobToView(null)}>No, stay</button>
                            <button type="button" className="delete-btn" onClick={confirmLeaveProfile}>Yes, go to job</button>
                        </div>
                    </div>
                )}
            </Modal>
        </section>
    )
}