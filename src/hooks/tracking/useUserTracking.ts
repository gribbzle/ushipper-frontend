import { useContext } from 'react';

import { UserTrackingContext } from '@/providers/UserTrackingProvider';
import { UserTracking } from '@store/client';

export const useUserTracking = (): UserTracking => {
    const context = useContext(UserTrackingContext);

    if (!context) {
        throw new Error('useUserTracking must be used within an UserTrackingProvider');
    }

    return context;
};
