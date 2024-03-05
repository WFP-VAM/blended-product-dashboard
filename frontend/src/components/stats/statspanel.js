import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ReferenceArea,
    ReferenceLine,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip
} from "recharts";
import { useContext, useState } from "react";
import { AppContext } from '../../contexts/context';
import Description from "./description";
import { mean, min, max, sum, median, joinArraysByKey, countLongestConsecutiveWithCriteria } from "../../calc/metrics";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import './statspanel.css'



export default function Chart() {
    const {
        params, timeseriesData, months, years
    } = useContext(AppContext)

    const [hoveringStats, setHoveringStats] = useState()

    if (timeseriesData.length === 0) return <div className="stats-panel empty">
        Select a feature to view seasonal blended rainfall statistics
    </div>
    function formatTimeseriesData(data) {
        return data.data.map((x, idx) => {
            return {
                v: data.data[idx],
                k: data.t[idx]
            }
        })
    }

    const formattedDates = {
        start: `${years.start}-01-01`,
        end: `${years.end + 1}-01-01`,
    }

    // const formattedDates = {
    //     start: `${months.start - months_buffer <= 0 ? years.start-1 : years.start}-${((months.start - months_buffer <=0 ? months.start - months_buffer + 12 : months.start - months_buffer)).toString().padStart(2, '0')}-01`,
    //     end: `${months.end + months_buffer > 12 ? years.end+1 : years.end}-${((months.end + months_buffer)%12).toString().padStart(2, '0')}-01`,
    // }
    // console.log(formattedDates)

    const years_arr = Array(years.end + 1 - years.start).fill(0).map((_, i) => i + years.start)

    function filterTimeseriesData(data, key, range) {
        return data.filter(d => d[key] >= range.start && d[key] <= range.end)
    }
    function markAsInRange(data, key, years, months) {
        return data.map(d => {
            const year = d[key].split('-')[0]
            const month = d[key].split('-')[1]
            const in_range = (
                year >= years.start &&
                year <= years.end &&
                month >= months.start &&
                month <= months.end
            )
            d.in_range = in_range ? parseInt(year) : 0
            return d
        })
    }
    const formattedData = formatTimeseriesData(timeseriesData)
    const filteredData = markAsInRange(
        filterTimeseriesData(formattedData, 'k', formattedDates),
        'k',
        years, months
    )

    const splitTS = years_arr.map(year => {
        return filteredData.filter(d => d.in_range === year)
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

    const data = joinArraysByKey(filteredData, seasonal_stats, 'k', 'label')

    const overall_stats = {
        mean: mean(seasonal_stats, 'sum'),
        min: min(seasonal_stats, 'sum'),
        max: max(seasonal_stats, 'sum'),
        sum: sum(seasonal_stats, 'sum'),
    }
    function getSeasonByYear(y) {
        return {
            stats: seasonal_stats.filter(d => parseInt(d.label.split('-')[0]) === y)[0],
            daily: splitTS.filter(d => d[0].in_range === y)[0],
            year: y
        }
    }

    const years_gt_param = years_arr.filter(
        y => {
            const season = getSeasonByYear(y).stats
            switch (params.op) {
                case "sum":
                    return season.sum > params.threshold
                case "mean":
                    return season.mean > params.threshold
                case "max":
                    return season.max > params.threshold
                case "streak":
                    return season.streak > params.threshold
                default:
                    return 0
            }
        }
    )

    const DailyTimeseries = <ResponsiveContainer width="100%" height={150}>
        <LineChart
            width={500}
            height={110}
            margin={{
                top: 15,
                right: 30,
                left: 5,
                bottom: 10,
            }}
            data={data}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="k" dy={5}
                xAxisId={"x"}
                ticks={data.map(d => d.label)}
            />
            <YAxis dataKey="v"
                yAxisId={"sum"}
            />
            <Legend align="right" height={10} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Line
                type="monotone"
                dataKey="v"
                xAxisId={"x"}
                yAxisId={"sum"}
                fillOpacity={1}
                stroke="#C76F85"
                dot={false}
            />
        </LineChart>
    </ResponsiveContainer>



    return (
        <div className="stats-panel">
            <Description data={filteredData} hoveringStats={hoveringStats} />
            <ResponsiveContainer width="100%" height={180}>
                <LineChart
                    width={500}
                    height={110}
                    margin={{
                        top: 15,
                        right: 30,
                        left: 5,
                        bottom: 10,
                    }}
                    data={data}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="k" dy={5}
                        xAxisId={"x"}
                        // hide={true}
                        ticks={data.map(d => d.label)}
                    />
                    <YAxis dataKey={params.op}
                        yAxisId={"agg"}
                        domain={['auto', 'auto']}
                    />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    {
                        years_arr.map(y => <ReferenceArea
                            x1={`${y}-${months.start.toString().padStart(2, '0')}-01`}
                            x2={`${y}-${months.end.toString().padStart(2, '0')}-01`}
                            strokeOpacity={0.3}
                            onMouseEnter={(e) => {
                                const season = getSeasonByYear(y)
                                setHoveringStats({stats: season.stats, year: season.year})
                            }}
                            onMouseLeave={(e) => {
                                setHoveringStats(null)
                            }}
                            yAxisId={"agg"}
                            xAxisId={"x"}
                            fill={years_gt_param.includes(y) ? "orange" : "gray"}
                            opacity={0.5}
                        />)
                    }
                    <Line
                        type="linear"
                        dataKey={params.op}
                        connectNulls
                        xAxisId={"x"}
                        yAxisId={"agg"}
                        fillOpacity={1}
                        dot={false}
                    />
                    <ReferenceLine
                        xAxisId={"x"}
                        yAxisId={"agg"}
                        stroke="orange"
                        y={params.threshold} />
                </LineChart>
            </ResponsiveContainer>
            <Accordion defaultExpanded>
                <AccordionSummary
                    aria-controls="panel1-content"
                    id="panel1-header"
                    sx={{
                    '&:hover': {
                        backgroundColor: 'rgba(184, 184, 184, 0.5)'
                    },
                }}
                >
                    <p>Daily Timeseries</p>
                </AccordionSummary>
                <AccordionDetails>
                    {DailyTimeseries}
                </AccordionDetails>
            </Accordion>

        </div>
    )
}