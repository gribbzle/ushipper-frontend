import React, { createContext, ReactNode } from 'react';

import { UserTracking } from '@store/client';

type UserTrackingProviderProps = {
    children: ReactNode;
    value: UserTracking;
};

export const UserTrackingContext = createContext<UserTracking | null>(null);

export const UserTrackingProvider = ({ children, value }: UserTrackingProviderProps) => (
    <UserTrackingContext.Provider value={value}>{children}</UserTrackingContext.Provider>
);
