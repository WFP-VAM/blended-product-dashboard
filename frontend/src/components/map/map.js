import React, { useEffect, useContext } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';
import { Mozambique } from './layers/layers';
import Mozambique_Geojson from '../../data/moz_bnd_adm2_WFP.json';
import { getArrayDepth } from '../../utils/utils';
import { useHover, useSelect } from './interaction/interaction';
import { useLayers } from './layers/useLayers';
import { useMap } from './useMap';
import { initViewport } from '../../data/init'
import { AppContext } from '../../contexts/context';

export default function Map() {
  if (process.env.REACT_APP_API_KEY == null) {
    throw new Error("You have to configure env REACT_APP_API_KEY, see README");
  }

  const {setTimeseriesData} = useContext(AppContext)

  const {
    map,
    mapContainer,
    mapLoaded,
    viewport,
    style,
    setStyle,
    flyToViewport,
    flyToBounds,
  } = useMap({
    initViewport: initViewport,
    access_token: process.env.REACT_APP_API_KEY
  });

  useLayers(map, [Mozambique])
  const {
    hoveringFeature, setHoveringFeature
  } = useHover(map, mapLoaded, "mozambique")

  function fetchStats(feature) {
    fetch(`https://api.earthobservation.vam.wfp.org/stats/admin/fetch?admin_id=${feature.properties.dataviz_adm2_id}&level=2&coverage=full&vam=rfh`)
      .then(r => r.json())
      .then(r => setTimeseriesData({
        data: r.data.rfh.flat(),
        t: r.date,
        t_int: r.date.map((x, idx) => idx)
      }))
  }

  const {
    selectedFeature, setSelectedFeature
  } = useSelect(map, mapLoaded, "mozambique", fetchStats)

  useEffect(() => {
    if (!mapLoaded) return
    if (!map) return
    map.fitBoundsToGeojson(Mozambique_Geojson)
  }, [map, mapLoaded])

  return (
    <div className="map-wrap">
      <a href="https://www.maptiler.com" className="watermark"><img
        src="https://api.maptiler.com/resources/logo.svg" alt="MapTiler logo" /></a>
      <div ref={mapContainer} className="map" />
    </div>
  );
}
