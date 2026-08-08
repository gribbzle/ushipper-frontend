import React from 'react';

import { Paper } from '@/components/common/paper/paper';
import { OrderOffer } from '@store/common/orders/types';
import { classname } from '@utils/classname';

import { OfferItemContent } from './offer-item-content';
import { OfferItemHeader } from './offer-item-header';
import { OfferItemRight } from './offer-item-right';

import './offer-item.scss';

const cn = classname('offer-item');

type Props = {
    offer: OrderOffer;
};

export const OfferItem = ({ offer }: Props) => (
    <Paper
        bodyClassName={cn()}
        body={
            <>
                <div className={cn('left')}>
                    <OfferItemHeader offer={offer} />
                    <OfferItemContent order={offer.order} />
                </div>
                <OfferItemRight offer={offer} />
            </>
        }
    />
);
