import React, { useMemo } from 'react';

import { FeeCategoryTermType } from '@/enums/fee/fee-category-term-types-enum';
import { Fee } from '@types';
import { classname } from '@utils/classname';
import { formatFeeValueType } from '@utils/fees';
import { translateByNamespace } from '@utils/i18n';

import './company-fees-info.scss';

const t = translateByNamespace('admin:accounting:company-card-info');
const tFees = translateByNamespace('admin:accounting:carrier-accounting-drawer');

const cn = classname('company-fees-info');

const renderFeeGroup = ({ title, fees }: { fees: Fee[]; title?: string }) => (
    <div className={cn()}>
        {title && <span className={cn('title')}>{title}</span>}
        {fees.map(({ value, valueType, feeCategory: { id, name } }) => (
            <div key={`${id}-${value}`} className={cn('fee')}>
                {name}:
                <span className={cn('value')}>
                    {value} {formatFeeValueType(valueType)}
                </span>
            </div>
        ))}
        {!fees?.length && t('empty-fees')}
    </div>
);

export const CompanyFeesInfo = ({ fees, showTitle = true }: { fees: Fee[]; showTitle?: boolean }) => {
    const delayedFees = useMemo(() => fees.filter(({ termType }) => termType === FeeCategoryTermType.DELAYED), [fees]);
    const instantFees = useMemo(() => fees.filter(({ termType }) => termType === FeeCategoryTermType.INSTANT), [fees]);
    const recurringFees = useMemo(() => fees.filter(fee => !!fee.recurringMonthDay || !!fee.recurringWeekDay || !!fee.intervalType) || [], [fees]);

    return (
        <div className={cn()}>
            {!!delayedFees?.length && renderFeeGroup({ title: showTitle ? tFees('delayed-terms-title') : undefined, fees: delayedFees })}
            {!!instantFees?.length && renderFeeGroup({ title: showTitle ? tFees('instant-terms-title') : undefined, fees: instantFees })}
            {!!recurringFees?.length && renderFeeGroup({ title: showTitle ? tFees('recurring-fees-title') : undefined, fees: recurringFees })}
            {!fees?.length && t('empty-fees')}
        </div>
    );
};
