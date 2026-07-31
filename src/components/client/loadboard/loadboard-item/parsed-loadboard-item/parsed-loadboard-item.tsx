import React from 'react';

import { ParsedOrderRoute } from '@/components/common/parsed-order-route/parsed-order-route';
import { Paper } from '@/components/ui/surfaces/paper/paper';
import { useOpenParsedOrderDetailsDrawer } from '@hooks';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { ParsedLoadboardItemPaymentBlock, ParsedLoadboardItemRightBlock, ParsedLoadBoardOrderBrokerColumn, ParsedOrderStatusBlock } from '../common';
import { LoadboardItemProps } from '../loadboard-item.types';

import './parsed-loadboard-item.scss';

const cn = classname('parsed-loadboard-item');
const t = translateByNamespace('client:loadboard:item:parsed-order-status');

export const ParsedLoadboardItem = ({ order, loadBoardFilters, tagged }: LoadboardItemProps) => {
    const {
        customerInformation,
        details,
        pickupInformation,
        deliveryInformation,
        vehicles,
        drivingDistance,
        isFlagged,
        userOrderStatus,
        source,
        hasInopVehicles,
        externalShipper,
    } = order;
    const { handleParsedOrderClick } = useOpenParsedOrderDetailsDrawer();

    return (
        <Paper
            className={cn('')}
            body={
                <div className={cn('wrapper', { flagged: isFlagged, tagged })}>
                    {userOrderStatus && <ParsedOrderStatusBlock view={userOrderStatus} label={t(userOrderStatus)} />}
                    <div
                        className={cn('content')}
                        onClick={e => {
                            e.stopPropagation();
                            handleParsedOrderClick(order.publicId);
                        }}
                    >
                        <ParsedLoadboardItemPaymentBlock order={order} tagged={tagged} />
                        <ParsedLoadBoardOrderBrokerColumn
                            company={customerInformation}
                            externalShipper={externalShipper}
                            details={details}
                            orderSource={source}
                        />
                        <ParsedOrderRoute
                            pickupInformation={pickupInformation}
                            deliveryInformation={deliveryInformation}
                            vehicles={vehicles}
                            drivingDistance={drivingDistance}
                            hasInopVehicles={hasInopVehicles}
                            trailerType={details.trailerType}
                            hideDirectionDistance={false}
                        />
                        <ParsedLoadboardItemRightBlock order={order} loadBoardFilters={loadBoardFilters} />
                    </div>
                </div>
            }
        />
    );
};
