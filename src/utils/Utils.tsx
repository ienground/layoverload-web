import LatLng = naver.maps.LatLng;

export function measureLocation(coordinate1: LatLng, coordinate2: LatLng): number {
    const earthRadius = 6378.137 // Radius of earth in KM

    const latDiff = coordinate2.lat() * Math.PI / 180 - coordinate1.lat() * Math.PI / 180
    const lonDiff = coordinate2.lng() * Math.PI / 180 - coordinate1.lng() * Math.PI / 180
    let a = Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
        Math.cos(coordinate1.lat() * Math.PI / 180) * Math.cos(coordinate2.lat() / 180) *
        Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2)
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    let d = earthRadius * c // Distance in km

    return d * 1000
}

export function diffToString(diff: number): string {
    // return diff.toString()
    if (diff < 1000) return `${diff.toFixed()}m`
    else if (diff < 10000) return `${(diff / 1000.0).toFixed(1)}km`
    else return `${(diff / 1000).toFixed()}km`
}
