function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180; // convert lat1 to radians
    const φ2 = (lat2 * Math.PI) / 180; // convert lat2 to radians
    const Δφ = ((lat2 - lat1) * Math.PI) / 180; // convert Δlat to radians
    const Δλ = ((lon2 - lon1) * Math.PI) / 180; // convert Δlon to radians

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // distance in meters
    return distance;
}

export { calculateDistance };
