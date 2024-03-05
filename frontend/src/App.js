import React, { useEffect } from 'react';
import Map from './components/map/map.js';
import Navbar from './components/navbar.js';
import './App.css';
import Chart from './components/stats/statspanel.js';
import Parameters from './components/parameters/parameters.js';
import { AppProvider } from './contexts/context.js';
import { SelectedFeatureProvider } from './contexts/selectedFeatureContext.js';

function App() {

  return (
    <AppProvider>
      <SelectedFeatureProvider >
      <div className="App">
        {/* <Navbar /> */}
        <Map />
        <Chart />
        <Parameters />
      </div>
      </SelectedFeatureProvider>
    </AppProvider>
  );
}

export default App;
