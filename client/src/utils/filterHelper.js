export function filterJobPostings(jobPostings, filters, user) {
    return jobPostings.filter((p) => {
        const matchesTitle = !filters.titleQuery || p.title?.toLowerCase().includes(filters.titleQuery.toLowerCase());
        const matchesLocation = !filters.locationQuery || p.location?.toLowerCase().includes(filters.locationQuery.toLowerCase());
        const matchesTag = !filters.selectedTag || p.tags?.some((tag) => tag.toLowerCase() === filters.selectedTag.toLowerCase());
        
        const hasApplied = user.role === "applicant" && p.applicants?.some((val) => String(val) === user.id);
        const matchesApplied = filters.appliedFilter === "all" || (filters.appliedFilter === "applied" && hasApplied) || (filters.appliedFilter === "not-applied" && !hasApplied);

        return matchesTitle && matchesLocation && matchesTag && matchesApplied;
    })
}