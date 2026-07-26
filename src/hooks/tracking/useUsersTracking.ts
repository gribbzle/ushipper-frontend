import { useContext } from 'react';

import { UsersTrackingContext } from '@providers';
import { UserTracking } from '@store/client';

export const useUsersTracking = (): UserTracking[] => {
    const context = useContext(UsersTrackingContext);

    if (!context) {
        throw new Error('useUsersTracking must be used within an UsersTrackingProvider');
    }

    return context;
};
