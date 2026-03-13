export function filterJobPostings(jobPostings, filters, user) {
    return jobPostings.filter((p) => {
        const matchesTitle = !filters.titleQuery || p.title?.toLowerCase().includes(filters.titleQuery.toLowerCase());
        const matchesLocation = !filters.locationQuery || p.location?.toLowerCase().includes(filters.locationQuery.toLowerCase());
        const matchesTag = !filters.selectedTag || p.tags?.some((tag) => tag.toLowerCase() === filters.selectedTag.toLowerCase());

        let matchesAppliedFilter = true;

        if (user.role === "applicant" || user.role === "") {
            const hasApplied = user.role === "applicant" && p.applicants?.some((val) => String(val) === user.id);

            matchesAppliedFilter = filters.appliedFilter === "all" || (filters.appliedFilter === "applied" && hasApplied) || (filters.appliedFilter === "not-applied" && !hasApplied);
        }
        else if (user.role === "company") {
            const isCompanies = String(p.companyId) === String(user.id);

            matchesAppliedFilter = filters.appliedFilter === "all" || (filters.appliedFilter === "mine" && isCompanies) || (filters.appliedFilter === "not-mine" && !isCompanies);
        }
        else {
            matchesAppliedFilter = filters.appliedFilter === "all";
        }
        
        return matchesTitle && matchesLocation && matchesTag && matchesAppliedFilter;
    })
}