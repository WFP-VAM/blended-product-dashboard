import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";
import { useEffect, useContext } from "react";
import { AppContext } from '../../contexts/context';

export default function Chart() {
    const {
        params, timeseriesData, selectedDates
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
        startDate: selectedDates.startDate.toISOString().split('T')[0],
        endDate: selectedDates.endDate.toISOString().split('T')[0]
    }
    console.log(formattedDates)
    console.log(formatTimeseriesData(timeseriesData))
    const formattedData = formatTimeseriesData(timeseriesData).filter(d => d.k >= formattedDates.startDate && d.k <= formattedDates.endDate)
    const streaks = formattedData.map((d, idx) => {
        const _slice = formattedData.slice(
            Math.max(idx - params.streak / 2, 0),
            Math.min(idx + params.streak / 2, formattedData.length)
        )
        return Object.assign(
            d, 
            { streak: params.op === ">" ? (_slice.every(d => d.v > params.threshold) ? 100 : 0 ) : (_slice.every(d => d.v < params.threshold) ? 100 : 0 )}
        )
    })

    return (
        <div className="stats-panel">
            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    width={500}
                    height={110}
                    data={formattedData}
                    margin={{
                        top: 15,
                        right: 30,
                        left: 5,
                        bottom: 10,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="k" dy={5} />
                    <YAxis dataKey="v" />
                    <Legend align="right" height={10} />
                    <Line
                        type="monotone"
                        dataKey="v"
                        fillOpacity={1}
                        stroke="#C76F85"
                        dot={false}
                    // activeDot={{ r: 5 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="streak"
                        fillOpacity={1}
                        dot={false}
                    // activeDot={{ r: 5 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}