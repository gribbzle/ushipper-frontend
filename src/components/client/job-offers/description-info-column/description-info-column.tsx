import React from 'react';

import { OrderItemInfoColumn } from '@/components/client/orders/order-item-info-column/order-item-info-column';
import { TextAccordion } from '@/components/common/text-accordion/text-accordion';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './description-info-column.scss';

const cn = classname('description-info');
const t = translateByNamespace('client:job-offers-page.job-offer.description');

export const DescriptionInfoColumn = ({ description }: { description: string }) => (
    <OrderItemInfoColumn title={t('title')} className={cn()}>
        <TextAccordion text={description} />
    </OrderItemInfoColumn>
);
