import React, { createContext, ReactNode, useCallback, useState } from 'react';

import { Driver, OrderTracking } from '@store/client';
import { Geo } from '@types';

export type DriverTrackingMap = {
    driver?: Driver;
    displayDriverLocation?: boolean;
    order?: OrderTracking;
    displayOrderRoute?: boolean;
    orders?: OrderTracking[];
    displayOrdersRoute?: boolean;
    optimizedRoute?: Geo;
    displayOptimizedRoute?: boolean;
    query?: string;
    hasOrders?: number;
    locationRectangle?: [number, number, number, number];
};

export interface DriverTrackingMapContextType {
    config: DriverTrackingMap;
    setConfig: (data: DriverTrackingMap) => void;
}

type TrackingProviderProps = {
    children: ReactNode;
};

export const DriverTrackingMapContext = createContext<DriverTrackingMapContextType | undefined>(undefined);

export const DriverTrackingMapProvider = ({ children }: TrackingProviderProps): JSX.Element => {
    const [config, setConfig] = useState<DriverTrackingMap>({
        hasOrders: 1,
        query: '',
    });

    const setData = useCallback((data: DriverTrackingMap): void => {
        setConfig(({ query, hasOrders }): DriverTrackingMap => ({ query, hasOrders, ...data }));
    }, []);

    return <DriverTrackingMapContext.Provider value={{ config, setConfig: setData }}>{children}</DriverTrackingMapContext.Provider>;
};
