import React, { useMemo } from 'react';

import { AlertBlock } from '@/components/common/alert-block/alert-block';
import { PROJECT_KEY_NAME } from '@constants';
import { FeeCategoryTermType } from '@/enums/fee/fee-category-term-types-enum';
import { AccountingAccountUserData } from '@store/api/accounting-accounts-api';
import { Fee } from '@/types/fee';
import { DotLeader } from '@/components/ui/data-display/dot-leader';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { isFreightX } from '@utils/project-config';
import { summarizeFees } from '@utils/transaction/summarize-fees';

import { useCompaniesFeesBlock } from './use-companies-fees-block';

import './companies-fees-block.scss';

const cn = classname('companies-fees-block');
const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:agreements');
const tFees = translateByNamespace('admin:accounting:carrier-accounting-drawer');

const renderFeeGroup = (title: string, items: { label: string; value: string }[], total: string) => (
    <div className={cn('fee-group')}>
        <h4 className={cn('title')}>{title}</h4>
        {items.length ? (
            <>
                {items.map(({ label, value }, index) => (
                    <DotLeader key={index} label={label} value={value} />
                ))}
                <DotLeader label={t('total-fees')} value={total} />
            </>
        ) : (
            <span>{t('company-fees-empty-alert')}</span>
        )}
    </div>
);

const CompanyFeesAlert = ({ fees, companyName }: { fees: Fee[]; companyName: string }) => {
    const { delayedFees, instantFees } = useCompaniesFeesBlock(fees);

    const totalDelayedFees = useMemo(() => {
        const delayedFees = fees.filter(({ termType }) => termType === FeeCategoryTermType.DELAYED);

        return summarizeFees(delayedFees);
    }, [fees]);

    const totalInstantFees = useMemo(() => {
        const instantFees = fees.filter(({ termType }) => termType === FeeCategoryTermType.INSTANT);

        return summarizeFees(instantFees);
    }, [fees]);

    return (
        <AlertBlock className={cn('alert')}>
            <div className={cn('fees')}>
                <h4 className={cn('company')}>{companyName}</h4>
                {renderFeeGroup(tFees(`${PROJECT_KEY_NAME}-delayed-terms-title`), delayedFees, totalDelayedFees)}
                {!isFreightX && renderFeeGroup(tFees(`${PROJECT_KEY_NAME}-instant-terms-title`), instantFees, totalInstantFees)}
            </div>
        </AlertBlock>
    );
};

export const CompaniesFeesBlock = ({ users = [] }: { users?: AccountingAccountUserData[] }) => (
    <div className={cn('')}>
        <h4 className={cn('title')}>{t('companies-fees-label')}</h4>
        {users.length > 0 ? (
            users.map(({ company }) => {
                if (!company) {
                    return;
                }

                const { fees, name, publicId } = company;

                return <CompanyFeesAlert key={publicId} companyName={name} fees={fees} />;
            })
        ) : (
            <AlertBlock>{t('companies-empty-alert')}</AlertBlock>
        )}
    </div>
);
