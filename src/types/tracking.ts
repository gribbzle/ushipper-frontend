export type Coordinate = {
    longitude: number;
    latitude: number;
};

export interface Location {
    latitude: number;
    longitude: number;
}

export interface Waypoint {
    name: string;
    location: [number, number];
    tripsIndex: number;
    waypointIndex: number;
}

export interface RouteGeometry {
    type: 'LineString';
    coordinates: [number, number][];
}

export interface Route {
    geometry: RouteGeometry;
    distance: number;
    duration: number;
}

export interface DirectionsResponse {
    routes: Route[];
    waypoints: Waypoint[];
    code: string;
}

export interface TripsResponse {
    trips: Route[];
    waypoints: Waypoint[];
    code: string;
}

export type Geo = {
    type: 'Feature';
    geometry: RouteGeometry;
    properties: {
        waypoints: Waypoint[];
    };
};
