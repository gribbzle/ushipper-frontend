import { useContext } from 'react';

import { OrderTrackingContext } from '@providers';
import { OrderTracking } from '@store/client';

export const useOrderTracking = (): OrderTracking => {
    const context = useContext(OrderTrackingContext);

    if (!context) {
        throw new Error('useOrderTracking must be used within an OrderTrackingProvider');
    }

    return context;
};
