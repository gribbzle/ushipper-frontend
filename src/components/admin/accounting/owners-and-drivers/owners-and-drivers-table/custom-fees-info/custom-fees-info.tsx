import React, { useMemo } from 'react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@components';
import { PROJECT_KEY_NAME } from '@constants';
import { CompanyType, FeeCategoryTermType } from '@enums';
import { AccountingAccountUserData } from '@store/api/accounting-accounts-api';
import { Fee } from '@types';
import {
    classname,
    formatFeeValueType,
    isRecurringFeeMonthIntervalType,
    isRecurringFeeWeekIntervalType,
    isUshipper,
    summarizeFees,
    translateByNamespace,
} from '@utils';

import { useDriversCompaniesFees } from '../../hooks';

import { formatRecurringFees } from './utils';

import './custom-fees-info.scss';

const tFees = translateByNamespace('admin:accounting:owners-and-drivers:table');

const cn = classname('custom-fees-info');

type FeeGroupProps = {
    fees: Fee[];
    title: string;
    companyFees?: Fee[];
    isRecurringFees?: boolean;
};

const getMissingFees = (companyFees: Fee[], userFees: Fee[]): Fee[] => {
    const userFeeIds = userFees.map(fee => fee.feeCategory.id);

    return companyFees.filter(companyFee => !userFeeIds.includes(companyFee.feeCategory.id));
};

const renderFeeGroup = ({ title, fees, companyFees = [], isRecurringFees = false }: FeeGroupProps) => {
    const missingCompanyFees = getMissingFees(companyFees, fees);
    const allFees = fees.length > 0 ? [...fees, ...missingCompanyFees] : companyFees;

    return (
        <Tooltip>
            <TooltipTrigger>
                <div className={cn('fee', { warning: fees.length > 0 && missingCompanyFees.length > 0 })}>
                    <p className={cn('title')}>{title}:</p>{' '}
                    <p className={cn('value')}>{isRecurringFees ? formatRecurringFees(fees) : summarizeFees(allFees)}</p>
                </div>
            </TooltipTrigger>
            <TooltipContent className={cn('details')}>
                {fees.map(({ value, feeCategory: { id, name, valueType } }) => (
                    <div key={`${id}-${value}`} className={cn('fee')}>
                        {name}:
                        <span className={cn('value')}>
                            {value}
                            {formatFeeValueType(valueType)}
                        </span>
                    </div>
                ))}
                {missingCompanyFees.map(({ value, feeCategory: { id, name, valueType } }) => (
                    <div key={`${id}-${value}`} className={cn('fee', { warning: fees.length > 0 })}>
                        {name}:
                        <span className={cn('value')}>
                            {value}
                            {formatFeeValueType(valueType)}
                        </span>
                    </div>
                ))}
            </TooltipContent>
        </Tooltip>
    );
};

const renderRecurringFeeGroup = ({ fees }: { fees: Fee[] }) => {
    const weeklyRecurringFees = fees.filter(fee => !!fee.recurringWeekDay || isRecurringFeeWeekIntervalType(fee.intervalType));
    const monthlyRecurringFees = fees.filter(fee => !!fee.recurringMonthDay || isRecurringFeeMonthIntervalType(fee.intervalType));

    if (!!weeklyRecurringFees.length && !!monthlyRecurringFees.length) {
        return renderFeeGroup({ title: tFees('recurring-fees-label'), fees: fees, isRecurringFees: true });
    }

    return (
        <>
            {!!weeklyRecurringFees.length && renderFeeGroup({ title: tFees('weekly-fees-label'), fees: weeklyRecurringFees })}
            {!!monthlyRecurringFees.length && renderFeeGroup({ title: tFees('monthly-fees-label'), fees: monthlyRecurringFees })}
        </>
    );
};

export const CustomFeesInfo = ({ fees, users }: { fees: Fee[]; users: AccountingAccountUserData[] }) => {
    const filteredUsers = users.filter(user => user.company && user.company.type !== CompanyType.DRIVER);
    const { delayedCompaniesFees, instantCompaniesFees } = useDriversCompaniesFees(filteredUsers);

    const delayedFees = useMemo(() => fees.filter(({ termType }) => termType === FeeCategoryTermType.DELAYED), [fees]);
    const instantFees = useMemo(() => fees.filter(({ termType }) => termType === FeeCategoryTermType.INSTANT), [fees]);
    const recurringFees = useMemo(() => fees.filter(fee => !!fee.recurringMonthDay || !!fee.recurringWeekDay || !!fee.intervalType) || [], [fees]);

    const delayedFeesTitle = useMemo(() => `${tFees(`${PROJECT_KEY_NAME}-delayed-terms-label`)}`, []);

    const instantFeesTitle = useMemo(() => `${tFees('instant-terms-label')}`, []);

    if (!fees.length && !delayedCompaniesFees.length && !instantCompaniesFees.length) {
        return <>—</>;
    }

    return (
        <div className={cn()}>
            {(!!delayedFees?.length || !!delayedCompaniesFees?.length) &&
                renderFeeGroup({ title: delayedFeesTitle, fees: delayedFees, companyFees: delayedCompaniesFees })}
            {isUshipper &&
                (!!instantFees?.length || !!instantCompaniesFees?.length) &&
                renderFeeGroup({ title: instantFeesTitle, fees: instantFees, companyFees: instantCompaniesFees })}

            {!!recurringFees?.length && renderRecurringFeeGroup({ fees: recurringFees })}
        </div>
    );
};
