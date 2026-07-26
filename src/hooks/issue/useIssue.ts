import { useContext } from 'react';

import { IssueContext } from '@providers';
import { IssueData } from '@store/api/issues-api';

export const useIssue = (): IssueData => {
    const context = useContext(IssueContext);

    if (!context) {
        throw new Error('useIssue must be used within an IssueProvider');
    }

    return context;
};
