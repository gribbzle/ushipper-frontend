import { MouseEvent, useCallback, useMemo } from 'react';

import { getFullNameOfVehicle, getVehicleTypeTranslation } from '@/utils/vehicle';
import { OrderVehicle } from '@/shared/types';

export const getVehicleLabel = (vehicle: OrderVehicle | string): string => {
    if (typeof vehicle === 'object') {
        return `${getFullNameOfVehicle(vehicle)} ${getVehicleTypeTranslation(vehicle)}`;
    } else {
        return vehicle;
    }
};

export const useVehiclesTooltip = (vehicles: (OrderVehicle | string)[]) => {
    const vehicleInfo = useMemo(() => {
        if (vehicles.length === 1) {
            const vehicle = vehicles[0];

            return getVehicleLabel(vehicle);
        }

        return null;
    }, [vehicles]);

    const handleClick = useCallback(
        (e: MouseEvent<HTMLDivElement>, vehicle?: OrderVehicle | string) => {
            e.stopPropagation();
            const search = vehicle ? getVehicleLabel(vehicle) : vehicleInfo;

            if (search) {
                window.open(`https://www.google.com/search?q=${encodeURIComponent(search)}  Dimensions`, '_blank');
            }
        },
        [vehicleInfo],
    );

    return { vehicleInfo, handleClick };
};
