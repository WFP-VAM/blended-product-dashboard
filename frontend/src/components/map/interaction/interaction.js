import { useEffect, useState, useRef } from "react";


function updatePaintProperties(map, style, layer, feature_state) {
    Object.keys(style).map((k) => {
        const v = style[k]
        const current = map.getPaintProperty(layer, k)
        map.setPaintProperty(
            layer,
            k,
            [
                'case',
                ['boolean', ['feature-state', feature_state], false],
                v,
                current
            ]
        );
    })
}

export function useHover(map, mapLoaded, source, layer, style) {
    const hoveringFeatureRef = useRef(null)
    const [hoveringFeature, setHoveringFeature] = useState(null)

    function updateFeatureState(map, id) {
        if (hoveringFeatureRef.current) {
            map.setFeatureState(
                { source: source, id: hoveringFeatureRef.current },
                { hover: false }
            );
        }
        map.setFeatureState(
            { source: source, id: id },
            { hover: true }
        );
        hoveringFeatureRef.current = id
    }

    useEffect(() => {
        if (!mapLoaded) return
        if (!map) return
        updateFeatureState(map, hoveringFeature)
    }, [map, mapLoaded, hoveringFeature])

    useEffect(() => {
        if (!mapLoaded) return
        if (!map) return
        if (!map.getLayer(layer)) return
        updatePaintProperties(map, style, layer, 'hover')
        map.on('mousemove', source, (e) => {
            if (e.features.length === 0) return
            setHoveringFeature(e.features[0].id)
        });
        map.on('mouseleave', source, (e) => {
            setHoveringFeature(null)
        });
    }, [map, mapLoaded])

    return { hoveringFeature, setHoveringFeature }
}

export function useSelect(map, mapLoaded, source, layer, f, style) {
    const selectedFeatureRef = useRef(null)
    const [selectedFeature, setSelectedFeature] = useState(null)

    function updateFeatureState(map, id) {
        if (selectedFeatureRef.current) {
            map.setFeatureState(
                { source: source, id: selectedFeatureRef.current },
                { selected: false }
            );
        }
        map.setFeatureState(
            { source: source, id: id },
            { selected: true }
        );
        selectedFeatureRef.current = id
    }

    useEffect(() => {
        console.log(map, mapLoaded, selectedFeature)
        if (!mapLoaded) return
        if (!map) return
        if (!selectedFeature) return
        updateFeatureState(map, selectedFeature.id)
    }, [map, mapLoaded, selectedFeature])

    useEffect(() => {
        if (!mapLoaded) return
        if (!map) return
        if (!map.getLayer(layer)) return
        updatePaintProperties(map, style, layer, 'selected')
        map.on('click', source, (e) => {
            console.log(e.features[0])
            if (e.features.length === 0) return
            setSelectedFeature(e.features[0])
        });
    }, [map, mapLoaded])

    useEffect(() => {
        console.log(selectedFeature)
        if (!mapLoaded) return
        if (!map) return
        if (!selectedFeature) return
        f(selectedFeature)
    }, [map, mapLoaded, selectedFeature])

    return { selectedFeature, setSelectedFeature }
}
