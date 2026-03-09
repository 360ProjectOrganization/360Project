export function formatDate(date) {
    const now = new Date();
    const posted = new Date(date);

    const day_difference = Math.floor((now - posted) / (1000 * 60 * 60 * 24));

    if (day_difference === 0) return "today";
    if (day_difference === 1) return "1 day ago";
    if (day_difference < 7) return `${day_difference} days ago`;


    const formatted = posted.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return formatted;
}
