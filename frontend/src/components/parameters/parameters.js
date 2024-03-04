import Calendar from '../calendar/calendar'
import RangeSlider from '../rangeslider/rangeslider'
import { useContext } from 'react'
import { AppContext } from '../../contexts/context'

export default function Parameters() {
    const { params, setParams } = useContext(AppContext)

    function updateParams(e) {
        const k = e.target.name
        const v = e.target.value
        const update = new Object(params)
        update[k] = parseFloat(v) ? parseFloat(v) : v
        console.log(update)
        setParams({ ...update })
    }

    return <div className="parameters">
        <h3>Define Season</h3>
        <RangeSlider />
        <br></br>
        <h3>Select Operation</h3>
        {/* <label for="op">Operation:</label> */}
        <select id="op" name="op" onChange={(e) => updateParams(e)} >
            <option value="sum">{'sum'}</option>
            <option value="mean">{'mean'}</option>
            <option value="max">{'max'}</option>
            <option value="streak">{'streak'}</option>
        </select>
        {
            params.op === "streak" && <>
                <br></br>
                <label for="wetdry_threshold">{params.gtlt === ">" ? "Wet " : "Dry "}Day Definition:</label>
                <input defaultValue={params.wetdry_threshold} type="number" id="wetdry_threshold" name="wetdry_threshold" required minlength="4" maxlength="8" size="10" onChange={(e) => updateParams(e)} />
                <br></br>
                <label for="gtlt">Operator:</label>
                <select id="gtlt" name="gtlt" onChange={(e) => updateParams(e)} >
                    <option value=">">{'>'}</option>
                    <option value="<">{'<'}</option>
                </select>
                <br></br>
            </>
        }
        <h3>Threshold</h3>
        <label for="threshold">Threshold:</label>
        <input defaultValue={params.threshold} type="number" id="threshold" name="threshold" required minlength="4" maxlength="8" size="10" onChange={(e) => updateParams(e)} />
        <br></br>
    </div>
}