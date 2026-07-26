import React from 'react';

import { OfferVehicles, OrderRoute, ViewOrderRouteButton } from '@components';
import { Load } from '@store/client';
import { classname, renderProjectSpecificComponent } from '@utils';

import { OfferCommodities } from '../../offer-commodities';

import './offer-item-content.scss';

const cn = classname('offer-item-content');

type Props = {
    order: Load;
};

export const OfferItemContent = ({ order }: Props) => {
    const { pickupInformation, deliveryInformation, drivingDistance, vehicles, commodities } = order;

    return (
        <div className={cn()}>
            <div className={cn('left')}>
                <OrderRoute inline={true} pickupInformation={pickupInformation} deliveryInformation={deliveryInformation} />
                <ViewOrderRouteButton pickupInformation={pickupInformation} deliveryInformation={deliveryInformation} drivingDistance={drivingDistance} />
            </div>
            {renderProjectSpecificComponent(
                {
                    OfferItemVehicles: <OfferVehicles className={cn('right')} vehicles={vehicles} />,
                    OfferItemCommodities: <OfferCommodities className={cn('right')} commodities={commodities} />,
                },
                'offerItemProducts',
            )}
        </div>
    );
};
