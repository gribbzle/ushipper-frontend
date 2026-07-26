import React, { createContext, ReactNode } from 'react';

import { IssueData } from '@store/api/issues-api';

type IssueProviderProps = {
    children: ReactNode;
    value: IssueData;
};

export const IssueContext = createContext<IssueData | null>(null);

export const IssueProvider = ({ children, value }: IssueProviderProps) => <IssueContext.Provider value={value}>{children}</IssueContext.Provider>;
