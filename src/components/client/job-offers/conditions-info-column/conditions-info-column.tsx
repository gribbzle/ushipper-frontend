import React from 'react';

import { OrderItemInfoColumn } from '@components';
import { classname, translateByNamespace } from '@utils';

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
