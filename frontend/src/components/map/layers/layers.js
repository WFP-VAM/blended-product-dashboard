import Mozambique_Geojson from '../../../data/moz_bnd_adm3_WFP.json';

export const Mozambique = {
    'id': 'mozambique',
    'type': 'fill',
    'source': 'mozambique',
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
        'data': Mozambique_Geojson,
        'promoteId': 'OBJECTID'
    }
}