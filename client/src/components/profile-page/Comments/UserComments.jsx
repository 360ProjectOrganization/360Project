import { useEffect, useState } from "react";
import { jobPostingApi } from "../../../utils/api";
import CommentsCard from "./CommentsCard";

export default function UserComments() {
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);

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

    return (
        <section className="comments-container">
            <h3>My Comments</h3>

            <div className="comments-list">
                {loading && <p>Loading...</p>}

                {!loading && comments.length === 0 && <p>No comments yet.</p>}

                {!loading && comments.map((c) => (
                    <CommentsCard key={c._id} jobTitle={c.jobTitle} content={c.content} />
                ))}
            </div>
        </section>
    )
}