import React, { useMemo } from 'react';

import { FloatingDropdown } from '@/components/common/dropdown/floating-dropdown';
import { StatusBlock } from '@/components/common/status-block/status-block';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/common/tooltip/tooltip';
import { ArrowDownIcon, TickIcon, XCircleIcon } from '@icons';
import { AccountingAccountData } from '@store/api/accounting-accounts-api';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { getAccountStatusTranslate } from '@utils/translate/get-account-status-translate';

import { useVerifiedStatusInfo } from './use-verified-status-info';

import './verified-status-info.scss';

const cn = classname('verified-status-info');
const t = translateByNamespace('admin:accounting:owners-and-drivers:table');

type RowProps = {
    label: string;
    checked: boolean;
};

const Row = ({ label, checked }: RowProps) => (
    <div className={cn('row')}>
        <span className={cn('icon')}>{checked ? <TickIcon className={cn('icon-success')} /> : <XCircleIcon className={cn('icon-danger')} />}</span>
        <span className={cn('label')}>{label}</span>
    </div>
);

export const VerifiedStatusInfo = ({ info, disabled = false }: { info: AccountingAccountData; disabled?: boolean }) => {
    const { phoneVerifiedAt, emailVerifiedAt, status } = info;
    const { options, statusView, defaultBalance, hasPartnerCompanies, isCompact } = useVerifiedStatusInfo(info);

    const content = useMemo(
        () => (
            <div className={cn('')}>
                <Row label={t('email-is-verified')} checked={!!emailVerifiedAt} />
                <Row label={t('phone-number-is-verified')} checked={!!phoneVerifiedAt} />
                <Row label={t('wallet-exists')} checked={!!defaultBalance} />
                <Row label={t('partner-company-assigned')} checked={hasPartnerCompanies} />
            </div>
        ),
        [defaultBalance, emailVerifiedAt, phoneVerifiedAt, hasPartnerCompanies],
    );

    return (
        <FloatingDropdown
            optionsClassName={cn('dropdown-options', { compact: isCompact })}
            dataTestId='account-status-actions'
            options={options}
            className={cn('dropdown', { compact: isCompact })}
            disabled={disabled}
        >
            <Tooltip>
                <TooltipTrigger>
                    <StatusBlock view={statusView}>
                        {getAccountStatusTranslate(status)} {!disabled && <ArrowDownIcon className={cn('dropdown-icon')} />}
                    </StatusBlock>
                </TooltipTrigger>
                <TooltipContent>{content}</TooltipContent>
            </Tooltip>
        </FloatingDropdown>
    );
};
