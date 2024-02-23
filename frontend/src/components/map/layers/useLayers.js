import { useEffect } from "react"

export function useLayers(map, layers) {

    useEffect(() => {
        if (!map) return
        map.on('load', () => layers.map(l => map.addLayer(l)))
    }, [map])
}
