import React from 'react';

import { CarrierTrackingPage, getMainLayout, TrackingPageHead } from '@components';

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
