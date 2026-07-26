import React from 'react';

import StatusIndicator from '@/components/common/status-indicator/status-indicator';
import { CompanyFMCSARecord } from '@store/api/company-api';
import { classname, formatToCurrency, translateByNamespace } from '@utils';

import { AddressBlock } from '../address-block';
import { AuthorityBlock } from '../authority-block';
import { CrashesBlock } from '../crashes-block';
import { FMCSATotalInfoBlock } from '../fmcsa-total-info-block';
import { FMCSAUpdateBlock } from '../fmcsa-update-block';
import { InsuranceBlock } from '../insurance-block';

import './fmcsa-full-info-block.scss';

type Props = {
    info: CompanyFMCSARecord;
    companyId: string;
};

const t = translateByNamespace('client:company-page:fmcsa-info');
const cn = classname('full-info-block');

export const FMCSAFullInfoBlock = ({ info, companyId }: Props) => {
    const isErrorClass = !info.allowedToOperate;

    return (
        <div className={cn('', { error: isErrorClass })}>
            <div className={cn('wrapper', { reverse: isErrorClass })}>
                <div className={cn('wrapper')}>
                    {!info.allowedToOperate && <StatusIndicator label={t('carrier-out-of-service')} checked={info.allowedToOperate} />}
                    <StatusIndicator
                        label={info.authorizedForProperty ? t('authored-for-property') : t('not-authored-for-property')}
                        checked={info.authorizedForProperty}
                    />
                    {!info.insuranceCargoRequired && <StatusIndicator label={t('insurance-cargo')} checked={info.insuranceCargoRequired} />}
                    {info.insuranceCargoRequired && (
                        <StatusIndicator
                            label={t('insurance-coverage-to', { number: formatToCurrency(info.insuranceCargoRequiredAmount) })}
                            checked={info.authorizedForProperty}
                        />
                    )}
                </div>
                <FMCSAUpdateBlock companyId={companyId} isCanBeRefreshed={info && info.canBeRefreshed} lastCheckedDate={info.createdAt} />
            </div>

            <FMCSATotalInfoBlock info={info} />
            <AddressBlock info={info} />
            <InsuranceBlock info={info} />
            <CrashesBlock info={info} />
            <AuthorityBlock info={info} />
        </div>
    );
};
