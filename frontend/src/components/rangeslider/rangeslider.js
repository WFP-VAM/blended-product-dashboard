import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import { useContext } from 'react'
import { AppContext } from '../../contexts/context'
import './rangeslider.css'

export const monthNames = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
};

export default function () {

    const { months, setMonths, years, setYears } = useContext(AppContext)


    function updateMonths(e) {
        setMonths(
            { start: e[0], end: e[1] }
        )
    }

    function updateYears(e) {
        setYears(
            { start: e[0], end: e[1] }
        )
    }

    return (
        <div className='range-slide-component'>
            <div className='values-display'>
                <span>{monthNames[months.start]}</span>
                <span>{monthNames[months.end]}</span>
            </div>
            <RangeSlider defaultValue={[months.start, months.end]} min={1} max={12} step={1} onInput={updateMonths} />
            <div className='values-display'>
                <span>{years.start}</span>
                <span>{years.end}</span>
            </div>
            <RangeSlider defaultValue={[years.start, years.end]} min={1990} max={2023} step={1} onInput={updateYears} />
        </div>
    );
}