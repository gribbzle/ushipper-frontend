import { useContext } from 'react';

import { OrderContext } from '@providers';
import { Load } from '@store/client';

export const useOrder = (): Load => {
    const context = useContext(OrderContext);

    if (!context) {
        throw new Error('useOrder must be used within an OrderProvider');
    }

    return context;
};
