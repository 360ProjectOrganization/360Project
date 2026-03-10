// Hash a string to an index, so that the same string always returns the same index 
// this allows tags to be the same colour across the site
function hashString(str) {
    const s = String(str).trim().toLowerCase();
    let hash = 0;

    for (let i = 0; i < s.length; i++) {
        hash += s.charCodeAt(i) * (i + 1);
    }

    return hash;
}

// get a #fun colour for a tag
export function getTagColor(tag) {
    const palette = [
        { bg: '#3b82f6', text: '#fff' },
        { bg: '#22c55e', text: '#fff' },
        { bg: '#f59e0b', text: '#1f2937' },
        { bg: '#ef4444', text: '#fff' },
        { bg: '#8b5cf6', text: '#fff' },
        { bg: '#ec4899', text: '#fff' },
        { bg: '#06b6d4', text: '#fff' },
        { bg: '#84cc16', text: '#1f2937' },
        { bg: '#f97316', text: '#fff' },
        { bg: '#6366f1', text: '#fff' },
    ];
    const i = hashString(tag) % palette.length;
    return palette[i];
}

export function formatDate(date) {
    const now = new Date();
    const posted = new Date(date);

    if (isNaN(posted.getTime())) {
        return "Unknown";
    }

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
