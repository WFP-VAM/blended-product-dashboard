import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';


import { getViewport } from "../../utils/viewportUtils";

export function useMap({ initViewport, access_token }) {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [viewport, setViewport] = useState(initViewport);

  function flyToViewport(viewport) {
    const viewport_formatted = {
      center: [viewport.longitude, viewport.latitude],
      zoom: viewport.zoom,
      bearing: viewport.bearing,
      pitch: viewport.pitch,
      transitionDuration: viewport.transitionDuration,
    };
    map.flyTo(viewport_formatted);
  }

  function flyToBounds(bounds) {
    map.fitBounds(bounds);
  }

  function fitBoundsToGeojson(geojson) {
    const coordinates = geojson.features.map(i => i.geometry.coordinates[0][0]).flat();
    const bounds = coordinates.reduce((bounds, coord) => {
      return bounds.extend(coord);
    }, new maplibregl.LngLatBounds(coordinates[0], coordinates[0]));

    map.fitBounds(bounds, {
      padding: 50
    });
  }

  useEffect(() => {
    if (map) return; // initialize map only once
    if (!mapContainer.current) return;
    console.log(viewport)
    setMap(
      new maplibregl.Map({
        container: mapContainer.current,
        style: `https://api.maptiler.com/maps/dataviz/style.json?key=${access_token}`,
        center: [viewport.longitude, viewport.latitude],
        // bearing: viewport.bearing,
        // pitch: viewport.pitch,
        zoom: viewport.zoom,
        boxZoom: false,
      }),
    );
  }, []);

  useEffect(() => {
    if (!map) return;
    map.on("load", () => {
      map.getCanvas().style.cursor = "pointer";
      map.setRenderWorldCopies(true);
      map.flyToViewport = flyToViewport;
      map.flyToBounds = flyToBounds;
      map.fitBoundsToGeojson = fitBoundsToGeojson;

      map.on("move", () => {
        setViewport(getViewport(map));
      });

      setMapLoaded(true);
    });
    map.on("click", () => console.log(map));
  }, [map]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    map,
    mapContainer,
    mapLoaded,
    viewport,
    setViewport,
    flyToViewport,
    flyToBounds,
  };
}
