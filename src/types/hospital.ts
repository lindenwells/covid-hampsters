type location = {
    _lat: number,
    _long: number
}

export type hospital = {
    location: location,
    max_beds: number,
    name: string,
    occupied_beds: number,
    postcode: number,
    region: string,
}