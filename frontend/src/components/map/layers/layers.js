import Mozambique3_Geojson from '../../../data/moz_bnd_adm3_WFP.json';
import Mozambique2_Geojson from '../../../data/moz_bnd_adm2_WFP.json';
import Mozambique1_Geojson from '../../../data/moz_bnd_adm1_WFP.json';

export const Mozambique3 = {
    'id': 'mozambique3',
    'type': 'fill',
    'source': 'mozambique3',
    'paint': {
        'fill-color': '#888888',
        'fill-outline-color': "grey",
        'fill-opacity': 0.3
    },
    // filter for (multi)polygons; for also displaying linestrings
    // or points add more layers with different filters
    'filter': ['==', '$type', 'Polygon'], 
    'source': {
        'type': 'geojson',
        'data': Mozambique3_Geojson,
        'promoteId': 'OBJECTID'
    }
}

export const Mozambique2 = {
    'id': 'mozambique2',
    'type': 'fill',
    'source': 'mozambique2',
    'paint': {
        'fill-color': '#888888',
        'fill-outline-color': "grey",
        'fill-opacity': 0.5
    },
    // filter for (multi)polygons; for also displaying linestrings
    // or points add more layers with different filters
    'filter': ['==', '$type', 'Polygon'], 
    'source': {
        'type': 'geojson',
        'data': Mozambique2_Geojson,
        'promoteId': 'OBJECTID'
    }
}

export const Mozambique1 = {
    'id': 'mozambique1',
    'type': 'fill',
    'source': 'mozambique1',
    'paint': {
        'fill-color': '#888888',
        'fill-outline-color': "grey",
        'fill-opacity': 0.5
    },
    // filter for (multi)polygons; for also displaying linestrings
    // or points add more layers with different filters
    'filter': ['==', '$type', 'Polygon'], 
    'source': {
        'type': 'geojson',
        'data': Mozambique1_Geojson,
        'promoteId': 'OBJECTID'
    }
}