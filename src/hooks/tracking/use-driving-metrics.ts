import { useEffect, useState } from 'react';

import { calculateDeliveryTime } from '@/utils/driving';
import { getDistanceMatrix } from '@api';

type Coordinates = {
    geoLatitude: number | null;
    geoLongitude: number | null;
};

export const useDrivingMetrics = (driverLocation?: Coordinates | null, targetLocation?: Coordinates | null, averageSpeed?: number | null) => {
    const [drivingDistance, setDrivingDistance] = useState<number | null>(null);
    const [time, setTime] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMetrics = async () => {
            if (
                !driverLocation ||
                !targetLocation ||
                driverLocation.geoLatitude === null ||
                driverLocation.geoLongitude === null ||
                targetLocation.geoLatitude === null ||
                targetLocation.geoLongitude === null
            ) {
                setTime(null);

                return;
            }

            const { geoLatitude: driverLat, geoLongitude: driverLon } = driverLocation;
            const { geoLatitude: targetLat, geoLongitude: targetLon } = targetLocation;

            if (driverLat === targetLat && driverLon === targetLon) {
                setDrivingDistance(0);
                setTime(0);

                return;
            }

            setLoading(true);
            try {
                const response = await getDistanceMatrix([
                    [driverLon, driverLat],
                    [targetLon, targetLat],
                ]);

                const distance = response.distances[0][1];

                setDrivingDistance(distance);
                setTime(averageSpeed ? calculateDeliveryTime(distance, averageSpeed) : null);
            } catch {
                setDrivingDistance(null);
                setTime(null);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, [driverLocation, targetLocation, averageSpeed]);

    return { drivingDistance, time, loading };
};
