import React, { createContext, ReactNode } from 'react';

type PublicIdProviderProps = {
    children: ReactNode;
    value: string;
};

export const PublicIdContext = createContext<string | null>(null);

export const PublicIdProvider = ({ children, value }: PublicIdProviderProps) => <PublicIdContext.Provider value={value}>{children}</PublicIdContext.Provider>;
