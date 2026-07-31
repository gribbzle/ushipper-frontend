import React, { useCallback, useMemo } from 'react';

import { MileCostTooltip } from '@/components/common/mile-cost-tooltip/mile-cost-tooltip';
import { PulseMarker } from '@/components/common/pulse-marker/pulse-marker';
import { calculateTotalPayment } from '@/utils/payment';
import { useAppDispatch, useAppSelector } from '@store';
import { OrderCommodity, OrderVehicle } from '@store/api/orders-api';
import { OrderPaymentInformation, selectedSuggestedOrderIdSelector, trackingActions } from '@store/client';
import { classname } from '@utils/classname';
import { formatToCurrency } from '@utils/numbers';

import './suggested-order-pin.scss';

const cn = classname('suggested-order-pin');

interface SuggestedOrderPinProps {
    publicId: string;
    paymentInformation: OrderPaymentInformation;
    drivingDistance?: number;
    vehicles: OrderVehicle[];
    commodities: OrderCommodity[];
}

export const SuggestedOrderPin = ({ publicId, paymentInformation, drivingDistance, vehicles, commodities }: SuggestedOrderPinProps) => {
    const dispatch = useAppDispatch();

    const totalAmount = useMemo(() => calculateTotalPayment(paymentInformation), [paymentInformation]);

    const selectedOrderId = useAppSelector(selectedSuggestedOrderIdSelector);

    const handleClickSuggestedOrderPin = useCallback(
        () => dispatch(trackingActions.setSelectedSuggestedOrderId(selectedOrderId === publicId ? null : publicId)),
        [dispatch, selectedOrderId, publicId],
    );

    return (
        <div className={cn()} onClick={handleClickSuggestedOrderPin}>
            <PulseMarker />
            <div className={cn('label', { active: selectedOrderId === publicId })}>
                {formatToCurrency(totalAmount)}
                <MileCostTooltip
                    drivingDistance={drivingDistance}
                    paymentInformation={paymentInformation}
                    vehicles={vehicles}
                    commodities={commodities}
                    classNameTitle={cn('value')}
                />
            </div>
        </div>
    );
};
