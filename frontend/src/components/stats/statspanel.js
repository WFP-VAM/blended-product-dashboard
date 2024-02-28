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
import { useContext } from "react";
import { AppContext } from '../../contexts/context';
import Description from "./description";
import { mean, min, max, sum, median, joinArraysByKey, linearInterpolation } from "../../calc/metrics";

export default function Chart() {
    const {
        params, timeseriesData, months, years
    } = useContext(AppContext)

    if (timeseriesData.length === 0) return
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

    console.log(seasonal_stats)
    const data = joinArraysByKey(filteredData, seasonal_stats, 'k', 'label')

    const overall_stats = {
        mean: mean(seasonal_stats, 'sum'),
        min: min(seasonal_stats, 'sum'),
        max: max(seasonal_stats, 'sum'),
        sum: sum(seasonal_stats, 'sum')
    }
    console.log(overall_stats)
    const years_gt_param = years_arr.filter(
        y => {
            const season = seasonal_stats.filter(d => parseInt(d.label.split('-')[0]) === y)
            return season[0].sum > params.threshold
        }
    )
    console.log(years_gt_param)
    // const seasonal_interpolated = linearInterpolation(data, 'mean')
    // console.log(seasonal_interpolated)

    return (
        <div className="stats-panel">
            <Description data={filteredData} />
            <ResponsiveContainer width="100%" height={300}>
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
                // data={data.filter( d => "sum" in d)}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="k" dy={5}
                        xAxisId={"x"}
                    />
                    <YAxis dataKey="sum"
                        yAxisId={"sum"}
                    />
                    <Legend align="right" height={10} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    {
                        years_arr.map(y => <ReferenceArea
                            x1={`${y}-${months.start.toString().padStart(2, '0')}-01`}
                            x2={`${y}-${months.end.toString().padStart(2, '0')}-01`}
                            strokeOpacity={0.3}
                            onMouseEnter={(e) => console.log(e)}
                            yAxisId={"sum"}
                            xAxisId={"x"}
                            fill={years_gt_param.includes(y) ? "cyan" : "gray"}
                            opacity={0.5}
                        />)
                    }
                    <Line
                        type="monotone"
                        dataKey="v"
                        xAxisId={"x"}
                        yAxisId={"sum"}
                        fillOpacity={1}
                        stroke="#C76F85"
                        dot={false}
                    // activeDot={{ r: 5 }}
                    />
                    <Line
                        type="linear"
                        dataKey="sum"
                        connectNulls
                        xAxisId={"x"}
                        yAxisId={"sum"}
                        fillOpacity={1}
                        dot={false}
                    // activeDot={{ r: 5 }}
                    />
                    {/* <Line
                        type="monotone"
                        dataKey="mean"
                        connectNulls
                        xAxisId={"x"}
                        yAxisId={"sum"}
                        fillOpacity={1}
                        dot={false}
                        lineTension={0}
                    // activeDot={{ r: 5 }}
                    /> */}
                    <ReferenceLine
                        xAxisId={"x"}
                        yAxisId={"sum"}
                        stroke="orange"
                        y={params.threshold} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}