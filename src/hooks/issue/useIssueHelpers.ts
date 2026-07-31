import { useMemo } from 'react';

import { IssueChangedByData } from '@store/api/issues-api';
import { isIssueDeclined, isIssueResolved } from '@utils/issue/helpers';
import { validateIssueChangesInfoDetails } from '@validators';

import { useIssue } from './useIssue';

export const useIssueHelpers = () => {
    const { status, payload } = useIssue();

    const isResolvedStatus = useMemo((): boolean => isIssueResolved(status), [status]);
    const isDeclinedStatus = useMemo((): boolean => isIssueDeclined(status), [status]);

    const changedBy = useMemo((): IssueChangedByData | undefined => {
        const result = validateIssueChangesInfoDetails(payload);

        return result?.changedBy;
    }, [payload]);

    return { isResolvedStatus, isDeclinedStatus, changedBy };
};
