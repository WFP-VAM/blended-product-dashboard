import { useEffect, useState, useRef } from "react";


export function useHover(map, mapLoaded, source) {
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

export function useSelect(map, mapLoaded, source, f) {
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
