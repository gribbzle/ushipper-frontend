import { useMemo } from 'react';

import { Transaction } from '@store/admin';
import { renderTextWithBreakLines } from '@utils/render';
import { formatFeesWithPeriod } from '@utils/transaction/format-used-fees';

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
