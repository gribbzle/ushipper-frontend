import React from 'react';

import { OrderItemInfoColumn, TextAccordion } from '@components';
import { classname, translateByNamespace } from '@utils';

import './description-info-column.scss';

const cn = classname('description-info');
const t = translateByNamespace('client:job-offers-page.job-offer.description');

export const DescriptionInfoColumn = ({ description }: { description: string }) => (
    <OrderItemInfoColumn title={t('title')} className={cn()}>
        <TextAccordion text={description} />
    </OrderItemInfoColumn>
);
