import React, { useCallback } from 'react';

import { AttachmentsImagesBlock } from '@/components/common';
import { getPaymentsTermsTranslate } from '@/utils/order';
import { useGetOrderQuery } from '@store/api/orders-api';
import { classname, translateByNamespace } from '@utils';

import './price-and-receipt-photos.scss';

type PriceAndReceiptPhotosProps = {
    price?: string;
    orderPublicId?: string;
    orderId?: string | null;
    disabled?: boolean;
};

const cn = classname('price-and-receipt-photos');
const t = translateByNamespace('admin:accounting:balance-table');

export const PriceAndReceiptPhotos = ({ price, orderPublicId, orderId, disabled = true }: PriceAndReceiptPhotosProps) => {
    const { data } = useGetOrderQuery(orderPublicId ?? '', { skip: !orderPublicId });
    const paymentInformation = data?.paymentInformation;
    const { terms, delayedTerms } = paymentInformation || {};

    const onPriceClickHandler = useCallback(() => {
        if (!disabled) {
            window.open(`/admin/accounting/cod-cop?searchSubject=order_id&search=${encodeURIComponent(orderId ?? '')}`, '_blank');
        }
    }, [orderId, disabled]);

    return (
        <>
            {price && (
                <span>
                    {t('price')}{' '}
                    <span className={cn('price', { disabled })} onClick={onPriceClickHandler}>
                        {price} {paymentInformation && (terms || delayedTerms) && `(${getPaymentsTermsTranslate(paymentInformation)})`}
                    </span>
                </span>
            )}
            {orderPublicId && <AttachmentsImagesBlock publicId={orderPublicId} />}
        </>
    );
};
