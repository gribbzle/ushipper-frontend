import React from 'react';

import { OfferVehicles } from '@/components/client/offers/offer-vehicles/offer-vehicles';
import { OrderRoute } from '@/components/client/orders/order-route/order-route';
import { ViewOrderRouteButton } from '@/components/client/orders/view-order-route-button/view-order-route-button';
import { Load } from '@store/client';
import { classname } from '@utils/classname';
import { renderProjectSpecificComponent } from '@utils/render-project-specific-component';

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
