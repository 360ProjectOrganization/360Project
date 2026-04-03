export default function StatCard({label, value}){
    return(
        <div className="stats-row">
                <div className="stat-card">
                    <p className="stat-label">{label}</p>
                    <h2 className="stat-value">{value}</h2>
                </div>
            </div>
    )
}