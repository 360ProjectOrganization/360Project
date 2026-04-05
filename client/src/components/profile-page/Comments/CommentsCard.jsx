import "./Comments.css";
import { formatDate } from "../../../utils/formatHelpers.js";

export default function CommentsCard({ jobTitle, date, content }) {
    return (
        <div className="user-comment-card">
            <section className="comment-header">
                <section className="comment-header-left">
                    <div className="comment-title">{jobTitle && <strong>{jobTitle}</strong>}</div>
                    <button className="comment-btn">Edit</button>
                    <button className="comment-btn">Delete</button>
                    <button className="comment-btn">View Job Post</button>
                </section>
                <div className="comment-date">{formatDate(date)}</div>
            </section>

            <hr />

            <div className="comment-content">
                <strong className="comment-label">Comment:</strong>
                <span className="comment-text">{content}</span>
            </div>
        </div>
    );
}