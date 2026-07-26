import { useMemo } from 'react';

import { Transaction } from '@store/admin';
import { formatFeesWithPeriod, renderTextWithBreakLines } from '@utils';

type useFeesInfoProps = Pick<Transaction, 'metadata' | 'createdAt'>;

export const useFeesInfo = ({ createdAt, metadata }: useFeesInfoProps) => {
    return useMemo(() => {
        const { usedFees } = metadata || {};

        if (!usedFees) {
            return null;
        }

        return renderTextWithBreakLines(formatFeesWithPeriod(usedFees, createdAt));
    }, [metadata, createdAt]);
};
