import React, { useMemo } from 'react';

import { Button } from '@/components/common/button/button';
import { ParsedOrderRoute } from '@/components/common/parsed-order-route/parsed-order-route';
import { LoadBoardFilters } from '@store/api/loadboard-api';
import { ParsedOfferData } from '@store/client/loadboard';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { formatToCurrency } from '@utils/numbers';

import { useCheckingOfferItem } from './use-checking-offer-item';

import './checking-offer-item.scss';

const t = translateByNamespace('client:loadboard:checking-contract-popup');
const tOrderId = translateByNamespace('client:loadboard:load-details');

const cn = classname('checking-offer-item');

type Props = {
    loadBoardFilters: LoadBoardFilters;
    parsedOrder: ParsedOfferData;
};

export const CheckingOfferItem = ({ parsedOrder, loadBoardFilters }: Props) => {
    const { handleChooseAndSignOffer, isLoading } = useCheckingOfferItem(loadBoardFilters);
    const {
        pickupInformation,
        deliveryInformation,
        vehicles,
        companyName,
        paymentInformation: { payment, delayedPayment },
        orderId,
        guid,
    } = parsedOrder;

    const paymentPrice = useMemo(() => (delayedPayment ?? 0) + (payment ?? 0), [delayedPayment, payment]);

    return (
        <div className={cn('')}>
            <div className={cn('content')}>
                <ParsedOrderRoute pickupInformation={pickupInformation} deliveryInformation={deliveryInformation} vehicles={vehicles} reverse={true} />
                <div className={cn('details')}>
                    <div className={cn('details-wrapper')}>
                        <p>{companyName}</p>
                        <span className={cn('details-order')}>{orderId && tOrderId('order-id', { orderId })}</span>
                    </div>
                    {paymentPrice > 0 && <span>{formatToCurrency(paymentPrice)}</span>}
                </div>
            </div>
            <div className={cn('footer')}>
                <Button hasLoader={isLoading} disabled={isLoading} plain={true} view='primary' size='small' onClick={() => handleChooseAndSignOffer(guid)}>
                    {t('choose-and-sign-offer-btn')}
                </Button>
            </div>
        </div>
    );
};
