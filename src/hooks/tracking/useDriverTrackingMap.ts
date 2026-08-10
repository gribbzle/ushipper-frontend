import { useContext } from 'react';

import { DriverTrackingMapContext, DriverTrackingMapContextType } from '@/providers/DriverTrackingMapProvider';

export const useDriverTrackingMap = (): DriverTrackingMapContextType => {
    const context = useContext(DriverTrackingMapContext);

    if (!context) {
        throw new Error('useDriverTrackingMap must be used within an DriverTrackingMapProvider');
    }

    return context;
};
