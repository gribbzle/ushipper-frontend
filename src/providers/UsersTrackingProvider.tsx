import React, { createContext, ReactNode } from 'react';

import { UserTracking } from '@store/client';

type UsersTrackingProviderProps = {
    children: ReactNode;
    value: UserTracking[];
};

export const UsersTrackingContext = createContext<UserTracking[] | null>(null);

export const UsersTrackingProvider = ({ children, value }: UsersTrackingProviderProps) => (
    <UsersTrackingContext.Provider value={value}>{children}</UsersTrackingContext.Provider>
);
