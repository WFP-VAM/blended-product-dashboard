import React, { useEffect, useContext, useState, useRef } from 'react';
import ReactDOMServer from 'react-dom/server';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';
import { Mozambique3, Mozambique2, Mozambique1 } from './layers/layers';
import Mozambique_Geojson from '../../data/moz_bnd_adm3_WFP.json';
import { getArrayDepth } from '../../utils/utils';
import { useHover, useSelect, usePaintPropertiesAcrossLayers } from './interaction/interaction';
import { useLayers } from './layers/useLayers';
import { useMap } from './useMap';
import { initViewport } from '../../data/init'
import { AppContext } from '../../contexts/context';
import { SelectedFeaturesContext } from '../../contexts/selectedFeatureContext';
import { getFeatureAdminLevel } from '../../data/featureParsing';



export default function Map() {
  if (process.env.REACT_APP_API_KEY == null) {
    throw new Error("You have to configure env REACT_APP_API_KEY, see README");
  }

  const { setTimeseriesData } = useContext(AppContext)
  const { selectedFeature, setSelectedFeature } = useContext(SelectedFeaturesContext)
  const previousPopup = useRef()

  const {
    map,
    mapContainer,
    mapLoaded,
    viewport,
    style,
    setStyle,
    flyToViewport,
    flyToBounds,
    click
  } = useMap({
    initViewport: initViewport,
    access_token: process.env.REACT_APP_API_KEY
  });

  useLayers(map, [Mozambique1, Mozambique2, Mozambique3])
  const {
    hoveringFeature, setHoveringFeature
  } = useHover(map, mapLoaded, "mozambique3", 'mozambique3', {
    "fill-opacity": 0.0,
    "fill-outline-color": "red",
  })

  useHover(map, mapLoaded, "mozambique2", 'mozambique2', {
    "fill-color": "white",
    "fill-outline-color": "red",
    "fill-opacity": 0.5
  })

  useHover(map, mapLoaded, "mozambique1", 'mozambique1', {
    "fill-color": "white",
    "fill-outline-color": "red",
    "fill-opacity": 0.2
  })

  function fetchStats(feature) {
    console.log(feature)
    // fetch(`https://api.earthobservation.vam.wfp.org/stats/admin/fetch?admin_id=${feature.properties.adm3_id}&level=3&coverage=full&vam=rfb&env=dev&tempres=daily`)
    fetch(`https://hdc-api.earthobservation.vam.wfp.org/stats/admin?id_code=${feature.properties.adm3_id}&level=3&coverage=full&vam=rfb&tempres=daily`)
      // fetch(`https://hdc-api.earthobservation.vam.wfp.org/stats/admin?id_code=${feature.properties.adm3_id}&level=3&coverage=full&vam=rfb`)
      .then(r => r.json())
      .then(r => {
        console.log(r)
        setTimeseriesData({
          data: r.data.rfb.flat(),
          t: r.date,
          t_int: r.date.map((x, idx) => idx)
        })
      })
  }

  const {
    selectedFeature: selectedFeature3,
    setSelectedFeature: setSelectedFeature3
  } = useSelect(
    map,
    mapLoaded,
    "mozambique3", "mozambique3",
    // fetchStats,
    () => { },
    {
      "fill-color": "cyan",
      "fill-opacity": 0.2,
      'fill-outline-color': 'red',
    }
  )

  const {
    selectedFeature: selectedFeature2,
    setSelectedFeature: setSelectedFeature2
  } = useSelect(
    map,
    mapLoaded,
    "mozambique2", "mozambique2",
    () => { },
    {
      "fill-color": "cyan",
      "fill-opacity": 0.2,
      'fill-outline-color': 'red',
    }
  )

  const {
    selectedFeature: selectedFeature1,
    setSelectedFeature: setSelectedFeature1
  } = useSelect(
    map,
    mapLoaded,
    "mozambique1", "mozambique1",
    () => { },
    {
      "fill-color": "cyan",
      "fill-opacity": 0.2,
      'fill-outline-color': 'red',
    }
  )

  function setSelectedByValue(key, value) {
    console.log(key, value)
    const feature = map.querySourceFeatures('mozambique3', {
      filter: ['==', ['get', key], value]
    })[0]
    const admin_level = getFeatureAdminLevel(feature)
    feature["source"] = `mozambique${admin_level}`
    setSelectedFeature(feature)
  }

  useEffect(() => {
    if (!mapLoaded) return
    if (!map) return
    map.fitBoundsToGeojson(Mozambique_Geojson)
  }, [map, mapLoaded])


  function HTML_Dropdown(id, options) {
    return <select id={id}>
      {options.map(o => <option value={o.id}>{o.name}</option>)}
    </select>
  }


  useEffect(() => {
    if (!map) return
    if (!click) return
    if (!(selectedFeature1 && selectedFeature2 && selectedFeature3)) return
    const id = `option-dropdown-${Math.floor(Math.random() * 100000)}`

    const select = HTML_Dropdown(
      id,
      [
      //   {
      //   id: JSON.stringify(selectedFeature1),
      //   name: selectedFeature1.properties.adm1_name
      // },
      {
        id: JSON.stringify(selectedFeature2),
        name: selectedFeature2.properties.adm2_name
      },
      {
        id: JSON.stringify(selectedFeature3),
        name: selectedFeature3.properties.adm3_name
      }]
    )
    const htmlString = ReactDOMServer.renderToString(select);
    try {
      const p1 = document.getElementById(previousPopup.current).parentElement.parentElement
      p1.remove()
    }
    catch {
      console.log('failed')
    }

    new maplibregl.Popup()
      .setLngLat(click.lngLat)
      .setHTML(htmlString)
      .addTo(map);

    document.getElementById(id).onchange = function (e) {
      console.log(JSON.parse(e.target.value))
      setSelectedFeature(JSON.parse(e.target.value))
    };
    previousPopup.current = id

  }, [map, click, selectedFeature1, selectedFeature2, selectedFeature3])

  usePaintPropertiesAcrossLayers(
    map, mapLoaded,
    ["mozambique1", "mozambique2", "mozambique3"],
    selectedFeature,
    "selected-override",
    { "fill-color": "cyan", "fill-opacity": 0.8 }
  )

  useEffect(() => {
    if (!map) return
    if (!selectedFeature || Object.keys(selectedFeature).length === 0) return
    console.log(selectedFeature)

    const field_mapping = {
      "mozambique3": {
        "level": 3,
        "id_field": "adm3_id",
      },
      "mozambique2": {
        "level": 2,
        "id_field": "dataviz_adm2_id",
      },
      "mozambique1": {
        "level": 1,
        "id_field": "dataviz_adm1_id",
      }
    }

    const id_code = field_mapping[selectedFeature.source]["id_field"]
    const level = field_mapping[selectedFeature.source]["level"]

    // fetch(`https://api.earthobservation.vam.wfp.org/stats/admin/fetch?admin_id=${feature.properties.adm3_id}&level=3&coverage=full&vam=rfb&env=dev&tempres=daily`)
    fetch(`https://hdc-api.earthobservation.vam.wfp.org/stats/admin?id_code=${selectedFeature.properties[id_code]}&level=${level}&coverage=full&vam=rfb&tempres=daily`)
      // fetch(`https://hdc-api.earthobservation.vam.wfp.org/stats/admin?id_code=${feature.properties.adm3_id}&level=3&coverage=full&vam=rfb`)
      .then(r => r.json())
      .then(r => {
        console.log(r)
        setTimeseriesData({
          data: r.data.rfb.flat(),
          t: r.date,
          t_int: r.date.map((x, idx) => idx)
        })
      })

    setSelectedFeature1(null)
    setSelectedFeature2(null)
    setSelectedFeature3(null)

  }, [map, selectedFeature])

  return (
    <div className="map-wrap">
      <a href="https://www.maptiler.com" className="watermark"><img
        src="https://api.maptiler.com/resources/logo.svg" alt="MapTiler logo" /></a>
      <div ref={mapContainer} className="map" />
      <div className={"data-selector"}>
        <h3>Set Admin3:</h3>
        <select id="feature" onChange={(e) => {
          setSelectedByValue("OBJECTID", parseInt(e.target.value))
        }}>
          {Mozambique_Geojson.features.map(f => <option value={f.properties.OBJECTID}>
            {f.properties.adm3_name}
          </option>)}
        </select>
      </div>
      <div>{JSON.stringify(selectedFeature1)}</div>
    </div>
  );
}
