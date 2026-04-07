import "./Comments.css";
import { useState } from "react";
import { formatDate } from "../../../utils/formatHelpers.js";

export default function CommentsCard({ comment, onSaveEdit, onDeleteClick, onViewJobPost }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content || "");

    const jobTitle = comment.jobTitle;
    const date = comment.editedAt || comment.createdAt;
    const content = comment.content;

    async function handleSave() {
        await onSaveEdit(comment._id, comment.jobId, editedContent);
        setIsEditing(false);
    }

    function handleCancel() {
        setEditedContent(comment.content || "");
        setIsEditing(false);
    }

    return (
        <div className="user-comment-card">
            <section className="comment-header">
                <section className="comment-header-left">
                    <div className="comment-title">{jobTitle && <strong>{jobTitle}</strong>}</div>

                    {!isEditing && (
                        <>
                            <button className="comment-btn" onClick={() => setIsEditing(true)}>Edit</button>
                            <button className="comment-btn" onClick={() => onDeleteClick(comment)}>Delete</button>
                            <button type="button" className="comment-btn" onClick={() => onViewJobPost?.(comment)}>View Job Post</button>
                        </>   
                    )}
                    
                </section>
                <div className="comment-date">{formatDate(date)}</div>
            </section>

            <hr />

            <div className="comment-content">
                <strong className="comment-label">Comment:</strong>

                {isEditing ? (
                    <div className="comment-edit-area">
                        <textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} rows={3} />
                        <div className="comment-edit-actions">
                            <button className="comment-btn" onClick={handleSave} disabled={!editedContent.trim()}>Save</button>
                            <button className="comment-btn" onClick={handleCancel}>Cancel</button>
                        </div>
                    </div>
                ) : (
                    <span className="comment-text">{content}</span>
                )}
            </div>
        </div>
    );
}