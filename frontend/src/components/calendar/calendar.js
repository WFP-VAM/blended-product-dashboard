import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { useState, useContext } from 'react';
import { AppContext } from '../../contexts/context';
import Collapsible from 'react-collapsible';

export default function MyCalender() {
    const { selectedDates, setSelectedDates } = useContext(AppContext)

    return (
        <Collapsible trigger="Select Date Range" classParentString='calender'>
            <DateRangePicker
                ranges={[selectedDates]}
                onChange={(d) => setSelectedDates(d.selection)}
            />
        </Collapsible>
    )
}
