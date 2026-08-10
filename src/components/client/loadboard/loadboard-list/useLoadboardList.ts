import { useCallback, useMemo } from 'react';

import { useLoadboardTabSelection } from '@/hooks/loadboard/useLoadboardTabSelection';
import { useAppSelector } from '@store';
import { loadboardListSelector } from '@store/client/loadboard';

export const useLoadboardList = () => {
    const { filters } = useAppSelector(loadboardListSelector);
    const { isAllTab } = useLoadboardTabSelection();

    const tagOrdersWithin = useMemo(() => (filters.newPostedOnTop ? filters.newPostedOnTopAfter : null), [filters.newPostedOnTopAfter, filters.newPostedOnTop]);

    const tagOrdersWithinDate = useMemo(() => {
        if (!tagOrdersWithin) {
            return null;
        }

        const now = new Date();

        now.setHours(now.getHours() - tagOrdersWithin);

        return now.getTime();
    }, [tagOrdersWithin]);

    const isOrderTagged = useCallback(
        (postedAt: string): boolean => (tagOrdersWithinDate ? isAllTab && new Date(postedAt).getTime() > tagOrdersWithinDate : false),
        [tagOrdersWithinDate, isAllTab],
    );

    return isOrderTagged;
};
