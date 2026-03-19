import "./admin.css"
export default function Analytics(){
    const userNumber = 10
    const jobPostings = 10000000
    const jobFillRate = 150000/200000*100
    return(
        <section className="analytics">
            <h1><span style={{ color: userNumber < 100 ? 'red' : 'green' }}>{userNumber}</span> <br />Users</h1>
            <h1><span style={{ color: jobPostings < 50 ? 'red' : 'green' }}>{jobPostings}</span><br />Job Postings</h1>
            <h1><span style={{ color: jobFillRate < 50 ? 'red' : 'green' }}>{jobFillRate}%</span> <br />Job Fill Rate</h1>
        </section>
    )
}