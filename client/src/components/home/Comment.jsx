import { formatDate } from "../../utils/formatHelpers.js";

export default function Comment({ comment, currentUserId, isFromJobOwner }) {
    const canEdit = currentUserId && String(comment.authorId) === String(currentUserId);

    return (
        <div className={`comment-item ${isFromJobOwner ? "owner-comment" : ""}`}>
            <div className="comment-item-header">
                <div className="comment-meta">
                    <div>
                        <strong>{comment.author}</strong>
                        {isFromJobOwner && (
                            <span className="comment-role-badge">Employer</span>
                        )}
                    </div>
                    <em className="comment-date">{formatDate(comment.createdAt)}</em>
                </div>

                {canEdit && <button className="comment-edit-btn">Edit</button>}
            </div>

            <p>{comment.content}</p>
        </div>
    );
}