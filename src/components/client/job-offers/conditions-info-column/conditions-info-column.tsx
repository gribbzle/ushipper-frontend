import React from 'react';

import { OrderItemInfoColumn } from '@/components/client/orders/order-item-info-column/order-item-info-column';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { ConditionsInfoColumnProps } from './conditions-info-column.types';
import { useConditionsInfoColumn } from './use-conditions-info-column';

import './conditions-info-column.scss';

const cn = classname('conditions-info');
const t = translateByNamespace('client:job-offers-page.job-offer.conditions');

export const ConditionsInfoColumn = ({ jobOffer }: ConditionsInfoColumnProps) => {
    const { firstLineDetails, secondLineDetails } = useConditionsInfoColumn(jobOffer);

    return (
        <OrderItemInfoColumn title={t('title')} className={cn()}>
            <div className={cn('wrapper')}>
                <div className={cn('first-line')}>
                    {firstLineDetails.map(
                        (detail, index) =>
                            !!detail.value && (
                                <div key={`first-${index}`} className={cn('detail')}>
                                    <span className={cn('label')}>{detail.label}:</span>
                                    <span className={cn('value')}>{detail.value}</span>
                                </div>
                            ),
                    )}
                </div>
                <div className={cn('second-line')}>
                    {secondLineDetails.map(
                        (detail, index) =>
                            !!detail.value && (
                                <div key={`second-${index}`} className={cn('detail')}>
                                    <span className={cn('label')}>{detail.label}:</span>
                                    <span className={cn('value')}>{detail.value}</span>
                                </div>
                            ),
                    )}
                </div>
            </div>
        </OrderItemInfoColumn>
    );
};
