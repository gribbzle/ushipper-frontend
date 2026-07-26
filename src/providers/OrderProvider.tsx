import React, { createContext, ReactNode } from 'react';

import { Load } from '@store/client';

type OrderProviderProps = {
    children: ReactNode;
    value: Load;
};

export const OrderContext = createContext<Load | null>(null);

export const OrderProvider = ({ children, value }: OrderProviderProps) => <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
