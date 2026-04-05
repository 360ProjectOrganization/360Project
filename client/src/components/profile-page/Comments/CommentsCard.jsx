export default function CommentsCard({ jobTitle, content }) {
    return (
        <div className="user-comment-card">
            {jobTitle && <strong>{jobTitle}</strong>}
            {content && <p>{content}</p>}
        </div>
    );
}