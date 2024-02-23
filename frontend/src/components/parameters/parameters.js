import Calendar from '../calendar/calendar'
import { useContext } from 'react'
import { AppContext } from '../../contexts/context'

export default function Parameters() {
    const {params, setParams } = useContext(AppContext)
 
    function updateParams(e) {
        const k = e.target.name
        const v = e.target.value
        const update = new Object(params)
        update[k] = parseFloat(v) ? parseFloat(v) : v
        setParams({ ...update })
    }

    return <div className="parameters">
        <label for="streak">Streak:</label>
        <input type="number" id="streak" name="streak" required minlength="4" maxlength="8" size="10" onChange={(e) => updateParams(e)} />
        <br></br>
        <label for="threshold">Threshold:</label>
        <input type="number" id="threshold" name="threshold" required minlength="4" maxlength="8" size="10" onChange={(e) => updateParams(e)} />
        <br></br>
        <label for="op">Operator:</label>
        <select id="op" name="op" onChange={(e) => updateParams(e)} >
            <option value="<">{'<'}</option>
            <option value=">">{'>'}</option>
        </select>
        <br></br>
        <Calendar />
    </div>
}