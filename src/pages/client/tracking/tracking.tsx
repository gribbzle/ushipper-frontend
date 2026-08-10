import React from 'react';

import { CarrierTrackingPage } from '@/components/client/tracking/tracking-page/carrier-tracking-page/carrier-tracking-page';
import { getMainLayout } from '@/components/common/main-layout/main-layout';
import { TrackingPageHead } from '@/components/client/tracking/tracking-page-head/tracking-page-head';

const TrackingPage = () => {
    return <CarrierTrackingPage />;
};

TrackingPage.getLayout = getMainLayout({
    head: <TrackingPageHead />,
    permissions: [
        { scope: 'carrierOrders', functionality: 'carrier.tracking.view_any' },
        { scope: 'shipperOrders', functionality: 'shipper.tracking.view_any' },
    ],
    className: 'tracking-page',
});

export default TrackingPage;
