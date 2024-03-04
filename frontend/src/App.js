import React, { useEffect } from 'react';
import Map from './components/map/map.js';
import Navbar from './components/navbar.js';
import './App.css';
import Chart from './components/stats/statspanel.js';
import Parameters from './components/parameters/parameters.js';
import { AppProvider } from './contexts/context.js';

function App() {

  return (
    <AppProvider>
      <div className="App">
        {/* <Navbar /> */}
        <Map />
        <Chart />
        <Parameters />
      </div>
    </AppProvider>
  );
}

export default App;
