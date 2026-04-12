import { useEffect, useState } from "react";

const presets = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
];
function getDatesBetween(start, end) {
    
    const dates = [];
    const current = new Date(start + "T00:00:00");
    const last = new Date(end + "T00:00:00");
    while (current <= last) {
        dates.push(current.toISOString().split("T")[0]);
        current.setDate(current.getDate() + 1);
    }
    return dates;
}
export default function SetDateForAnalytics({setDatesRange}){
    //https://stackoverflow.com/questions/69523284/can-we-create-start-date-and-end-date-using-react-date-picker
    // Didnt copy it but was very useful
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    const fmt = (d) => d.toISOString().split("T")[0];
    const [beginingDate, setBeginingDate ] = useState(fmt(sevenDaysAgo));
    const [endDate, setEndDate] =useState(fmt(today));
    const handleStartChange = (e) => {
        const val = e.target.value;
        setBeginingDate(val);
        if (endDate && val > endDate) setEndDate("");
    };

    const handleEndChange = (e) => {
        const val = e.target.value;
        setEndDate(val);
    };
    const setPreset = (days) => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - days);
        const fmt = (d) => d.toISOString().split("T")[0];
        setBeginingDate(fmt(start));
        setEndDate(fmt(end));

    };
    useEffect(()=>{
        if (beginingDate && endDate) {
            setDatesRange(getDatesBetween(beginingDate,endDate));
        }

    },[beginingDate, endDate]);
    useEffect(()=>{
        if (beginingDate && endDate) {
            setDatesRange(getDatesBetween(beginingDate, endDate));
        }else{
            console.log("FAIL")
        }

    },[])
    return(
        <div>
        <div className="date-range-picker-presets">
            {presets.map(({ label, days }) => (
            <button
                key={days}
                className="date-range-picker__preset-btn"
                onClick={() => setPreset(days)}
            >
                {label}
            </button>
            ))}
        </div>
        <div className="date-range-picker">
            <label className="date-range-picker__label">
            Start
            <input
                type="date"
                className="date-range-picker__input"
                value={beginingDate}
                max={endDate || undefined}
                onChange={handleStartChange}
            />
            </label>
            <span className="date-range-picker__separator">→</span>
            <label className="date-range-picker__label">
            End
            <input
                type="date"
                className="date-range-picker__input"
                value={endDate}
                min={beginingDate || undefined}
                onChange={handleEndChange}
            />
            </label>
        </div>
        </div>
    )
}