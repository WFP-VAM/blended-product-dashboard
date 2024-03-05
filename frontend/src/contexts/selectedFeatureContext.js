import React, { createContext, useEffect, useState } from 'react';
const SelectedFeaturesContext = createContext();

// Creating a provider component
const SelectedFeatureProvider = ({ children }) => {
    const [selectedFeature, setSelectedFeature] = useState({})

    return (
        <SelectedFeaturesContext.Provider value={{
            selectedFeature, setSelectedFeature
        }}>
            {children}
        </SelectedFeaturesContext.Provider>
    );
};

export { SelectedFeaturesContext, SelectedFeatureProvider };