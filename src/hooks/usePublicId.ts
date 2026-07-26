import { useContext } from 'react';

import { PublicIdContext } from '@providers';

export const usePublicId = () => {
    const context = useContext(PublicIdContext);

    if (!context) {
        throw new Error('usePublicId must be used within an PublicIdProvider');
    }

    return context;
};
