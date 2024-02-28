import { useEffect, useContext } from "react";
import { AppContext } from '../../contexts/context';
import { monthNames } from "../rangeslider/rangeslider";
import { mean, min, max, sum, median } from "../../calc/metrics";


export default function Description({ data }) {
    const {
        params, months, years
    } = useContext(AppContext)

    const daily_stats = {
        mean: mean(data.filter(d => d.in_range), 'v'),
        min: min(data.filter(d => d.in_range), 'v'),
        max: max(data.filter(d => d.in_range), 'v'),
        sum: sum(data.filter(d => d.in_range), 'v')
    }

    const years_arr = Array(years.end + 1 - years.start).fill(0).map((_, i) => i + years.start)
    const splitTS = years_arr.map(year => {
        return data.filter(d => d.in_range === year)
    })

    console.log(splitTS)
    const seasonal_stats = splitTS.map(data => {
        return {
            mean: mean(data, 'v'),
            min: min(data, 'v'),
            max: max(data, 'v'),
            sum: sum(data, 'v'),
            label: median(data, 'k')
        }
    })


    return <div>
        <div>{monthNames[months.start]} - {monthNames[months.end]} </div>
        <div>Daily stats: {Object.keys(daily_stats).map(
            x => {
                return <div>{x}: {daily_stats[x]}</div>
            }
        )}</div>
        {params.threshold && <div>
            Seasons with greater than {params.threshold}mm of rain: {seasonal_stats.filter(d => d.sum > params.threshold).length}{" "}
            out of {seasonal_stats.length}
        </div>}

    </div>
}