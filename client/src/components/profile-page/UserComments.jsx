import { useEffect, useState } from "react";
import { jobPostingApi } from "../../utils/api";

export default function UserComments({ userId }) {
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState([]);

    async function fetchComments() {
        if (!userId) return;
        try {
            const data = await jobPostingApi.getUserComments(userId);
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
    }, [userId]);

    return (
        <>
            BRUH
        </>
    )
}