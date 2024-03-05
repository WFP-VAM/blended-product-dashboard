import { useEffect, useContext } from "react";
import { AppContext } from '../../contexts/context';
import { SelectedFeaturesContext } from "../../contexts/selectedFeatureContext";
import { monthNames } from "../rangeslider/rangeslider";
import { mean, min, max, sum, median, countLongestConsecutiveWithCriteria } from "../../calc/metrics";
import "./description.css"
import { getFeatureAdminLevel } from "../../data/featureParsing";


export default function Description({ data, hoveringStats }) {
    const {
        params, months, years
    } = useContext(AppContext)

    const {
        selectedFeature
    } = useContext(SelectedFeaturesContext)

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

    const seasonal_stats = splitTS.map(data => {
        return {
            mean: mean(data, 'v'),
            min: min(data, 'v'),
            max: max(data, 'v'),
            sum: sum(data, 'v'),
            label: median(data, 'k'),
            streak: countLongestConsecutiveWithCriteria(data, d => d.v, params.wetdry_threshold, params.gtlt)
        }
    })

    daily_stats['streak'] = mean(seasonal_stats, 'streak')
    const admin_level = getFeatureAdminLevel(selectedFeature)
    console.log(selectedFeature)

    return <div className='stats-header'>

        <div>Admin {admin_level}: {selectedFeature.properties[`adm${admin_level}_name`]} </div>
        <div>{monthNames[months.start]} - {monthNames[months.end]} </div>
        <div>Daily {params.op}: {daily_stats[params.op]}</div>
        {params.threshold && <div className="description">
            Seasons meeting {params.threshold}mm of rain: {seasonal_stats.filter(d => d.sum > params.threshold).length}{" "}
            out of {seasonal_stats.length}
        </div>}
        {hoveringStats && <div>{hoveringStats.year}: {hoveringStats.stats[params.op]}</div>}

    </div>
}