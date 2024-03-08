import Calendar from '../calendar/calendar'
import RangeSlider from '../rangeslider/rangeslider'
import { useContext } from 'react'
import { AppContext } from '../../contexts/context'
import INAM_logo from './INAM_logo.jpeg';
import Flag_icon from './Flag.png';
import "./parameters.css"

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
        <span className="logos">
            <img src={INAM_logo} className='logo' />
            <img src={Flag_icon} className='logo flag' />
        </span>
        <h3>Define Season</h3>
        <RangeSlider />
        <br></br>
        <h3>Select Operation</h3>
        {/* <label for="op">Operation:</label> */}
        <select id="op" name="op" onChange={(e) => updateParams(e)} >
            <option value="sum">{'Sum'}</option>
            <option value="mean">{'Mean'}</option>
            <option value="max">{'Max'}</option>
            <option value="streak">{'Longest streak'}</option>
            <option value="count">{'Count'}</option>
        </select>
        {
            ["streak", "count"].includes(params.op) && <>
                <br></br>
                <label for="wetdry_threshold">Rainfall Threshold:</label>
                <input defaultValue={params.wetdry_threshold} type="number" id="wetdry_threshold" name="wetdry_threshold" required minlength="4" maxlength="8" size="10" onChange={(e) => updateParams(e)} />
                <br></br>
                <label for="gtlt">Operator:</label>
                <select id="gtlt" value={params.gtlt} name="gtlt" onChange={(e) => updateParams(e)} >
                    <option value=">">{'>'}</option>
                    <option value="<">{'<'}</option>
                </select>
                <br></br>
            </>
        }
        <h3>Seasonal Threshold</h3>
        <label for="threshold">Threshold:</label>
        <input defaultValue={params.threshold} type="number" id="threshold" name="threshold" required minlength="4" maxlength="8" size="10" onChange={(e) => updateParams(e)} />
        <br></br>
    </div>
}