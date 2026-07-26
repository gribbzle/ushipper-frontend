import { useMemo } from 'react';

import { translateByNamespace } from '@utils';

import { ParsedOrderRouteProps } from './parsed-order-route.types';
import { formatAddressLine } from './utils';

const t = translateByNamespace('client:loadboard:parsed-order-route');

export const useParsedOrderRoute = ({ pickupInformation, deliveryInformation }: Pick<ParsedOrderRouteProps, 'pickupInformation' | 'deliveryInformation'>) => {
    const deliveryAddressLine = useMemo(() => formatAddressLine(deliveryInformation) || t('no-zip'), [deliveryInformation]);
    const pickupAddressLine = useMemo(() => formatAddressLine(pickupInformation) || t('no-zip'), [pickupInformation]);

    const { geoLatitude: pickupGeoLatitude, geoLongitude: pickupGeoLongitude } = pickupInformation || {};
    const { geoLatitude: deliveryGeoLatitude, geoLongitude: deliveryGeoLongitude } = deliveryInformation || {};

    const pickupCoords = useMemo(() => ({ latitude: pickupGeoLatitude, longitude: pickupGeoLongitude }), [pickupGeoLatitude, pickupGeoLongitude]);
    const deliveryCoords = useMemo(() => ({ latitude: deliveryGeoLatitude, longitude: deliveryGeoLongitude }), [deliveryGeoLatitude, deliveryGeoLongitude]);

    return { pickupAddressLine, deliveryAddressLine, pickupCoords, deliveryCoords };
};
