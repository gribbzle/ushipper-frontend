import React, { createContext, ReactNode } from 'react';

import { OrderTracking } from '@store/client';

type OrderTrackingProviderProps = {
    children: ReactNode;
    value: OrderTracking;
};

export const OrderTrackingContext = createContext<OrderTracking | null>(null);

export const OrderTrackingProvider = ({ children, value }: OrderTrackingProviderProps) => (
    <OrderTrackingContext.Provider value={value}>{children}</OrderTrackingContext.Provider>
);
