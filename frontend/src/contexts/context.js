// AppContext.js
import React, { createContext, useEffect, useState } from 'react';
import { initDates } from '../data/init';

// Creating a context
const AppContext = createContext();

// Creating a provider component
const AppProvider = ({ children }) => {
    const [selectedDates, setSelectedDates] = useState(initDates);
    const [timeseriesFunctionParams, setTimeseriesFunctionParams] = useState({})
    const [params, setParams] = useState({})
    const [timeseriesData, setTimeseriesData] = useState([])

    function updateParams(d) {
        setParams(Object.assign(...d))
    }

    const params_to_watch = [selectedDates, timeseriesFunctionParams]

    useEffect(() => {
        updateParams(params_to_watch)
    }, params_to_watch)

    return (
        <AppContext.Provider value={{ selectedDates, setSelectedDates, params, setParams, timeseriesData, setTimeseriesData }}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppProvider };