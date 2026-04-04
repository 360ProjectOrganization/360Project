import { useEffect, useState } from "react";

export default function JobPostings(){
    const [loading, setLoading] = useState(true);
    const [postings, setPostings] =useState([]);
    useEffect(()=>{
        const getAllJobPostings=(async()=>{
            const companies = await companyApi.getAll();
            try {
                const companies = await companyApi.getAll();

                const postingsByCompany = await Promise.all(
                    companies.map(async (company) => {
                        const postings = await companyApi.getJobPostings(company._id);

                        return postings.map((posting) => ({
                            ...posting,
                            companyName: company.name,
                            companyId: company._id,
                        }));
                    })
                );

                const postings = postingsByCompany.flat();
                postings.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

                setPostings(postings);
            }
            catch (err) {
                console.error("Failed to load job postings: ", err);
                setLoadError(err?.message || "Failed to load job postings");
            }
            finally {
                setLoading(false);
            }
        })

       getAllJobPostings();
    },[]);
    if (loading) return <div style={{ padding: "20px" }}>Loading job postings...</div>;

}