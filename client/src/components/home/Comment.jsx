import { useState } from "react";
import { formatDate } from "../../utils/formatHelpers.js";

export default function Comment({ comment, currentUserId, role, isFromJobOwner, onSaveEdit, onDeleteClick }) {
    const isOwner = currentUserId && String(comment.authorId) === String(currentUserId);
    const canEdit = isOwner;
    const canDelete = role === "administrator" || ((role === "applicant" || role === "company") && isOwner);

    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);

    const wasEdited = comment.editedAt && String(comment.editedAt) !== String(comment.createdAt);

    const handleCancel = () => {
        setEditedContent(comment.content);
        setIsEditing(false);
    };

    const handleSave = async () => {
        const trimmedContent = editedContent.trim();
        if (!trimmedContent || !onSaveEdit) return;

        try {
            await onSaveEdit(comment._id, trimmedContent);
            setIsEditing(false);
        }
        catch (error) {
            console.error("Failed to update comment:", error);
        }
    };

    return (
        <div className={`comment-item ${isFromJobOwner ? "owner-comment" : ""}`}>
            <div className="comment-item-header">
                <div className="comment-meta">
                    <div>
                        <strong>{comment.author}</strong>
                        {isFromJobOwner && (
                            <span className="comment-role-badge">Employer</span>
                        )}
                        {comment.authorRole === 'administrator' && (
                            <span className="comment-role-badge comment-role-badge--admin">Admin</span>
                        )}
                    </div>
                    <em className="comment-date">
                        {formatDate(comment.createdAt)}
                        {wasEdited && <> · Edited {formatDate(comment.editedAt)}</>}
                    </em>
                </div>

                {!isEditing && (canEdit || canDelete) && (
                    <div className="comment-action-btns">
                        {canEdit && (
                            <button className="comment-edit-btn" onClick={() => { setEditedContent(comment.content); setIsEditing(true); }}>Edit</button>
                        )}
                        {canDelete && (
                            <button className="comment-delete-btn" onClick={() => onDeleteClick?.(comment)}>Delete</button>
                        )}
                    </div>
                )}
            </div>

            {isEditing ? (
                <div className="comment-edit-area">
                    <textarea className="comment-edit-textarea" value={editedContent} onChange={(e) => setEditedContent(e.target.value)} />
                    <div className="comment-edit-actions">
                        <button className="comment-save-btn" onClick={handleSave}>Save</button>
                        <button className="comment-cancel-btn" onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            ) : (
                <p className="comment-body">{comment.content}</p>
            )}
        </div>
    );
}