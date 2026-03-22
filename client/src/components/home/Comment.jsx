import { formatDate } from "../../utils/formatHelpers.js";

export default function Comment({ comment }) {
    return (
        <div className="comment-item">
            <strong>{comment.author}</strong>
            {formateDate(comment.createdAt)}
            <p>{comment.content}</p>
        </div>
    );
}