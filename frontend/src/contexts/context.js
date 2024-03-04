// AppContext.js
import React, { createContext, useEffect, useState } from 'react';
import { initYears, initMonths, initParams } from '../data/init';

// Creating a context
const AppContext = createContext();

// Creating a provider component
const AppProvider = ({ children }) => {
    const [timeseriesFunctionParams, setTimeseriesFunctionParams] = useState({})
    const [params, setParams] = useState(initParams)
    const [timeseriesData, setTimeseriesData] = useState([])
    const [years, setYears] = useState(initYears)
    const [months, setMonths] = useState(initMonths)

    function updateParams(d) {
        console.log(d)
        setParams(Object.assign(...d))
    }

    const params_to_watch = [params, timeseriesFunctionParams, months, years]

    useEffect(() => {
        updateParams(params_to_watch)
    }, params_to_watch)

    return (
        <AppContext.Provider value={{
            params, setParams,
            timeseriesData, setTimeseriesData,
            months, setMonths,
            years, setYears
        }}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppProvider };