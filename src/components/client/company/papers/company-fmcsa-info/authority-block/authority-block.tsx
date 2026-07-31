import React, { useMemo } from 'react';

import { CollapsibleSection } from '@/components/common/collapsible-section/collapsible-section';
import { CompanyFMCSAAuthorizedInfo, CompanyFMCSARecord } from '@store/api/company-api';
import { DotLeader } from '@ui';
import { translateByNamespace } from '@utils/i18n';
import { translateBooleanOrFormatValue } from '@utils/translations';

type Props = {
    info: CompanyFMCSARecord;
};

const authorityFieldConfig = {
    authorityCommon: 'common-authority-status',
    authorityContract: 'contract-authority-status',
    authorityBroker: 'broker-authority-status',
    authorizedForBroker: 'authorized-for-broker',
    authorizedForProperty: 'authorized-for-property',
    authorizedForPassenger: 'authorized-for-passenger',
    authorizedForGoods: 'authorized-for-household-goods',
};

const t = translateByNamespace('client:company-page:fmcsa-info:fields:authority-group');
const translateEmptyTitle = translateByNamespace('client:company-page');

export const AuthorityBlock = ({ info }: Props) => {
    const docketNumber = useMemo(
        () => (info.docketNumber ? `${info.docketPrefix} ${info.docketNumber}` : translateEmptyTitle('empty-value')),
        [info.docketPrefix, info.docketNumber],
    );

    const authorityFields = useMemo(
        () =>
            (Object.keys(authorityFieldConfig) as Array<keyof CompanyFMCSAAuthorizedInfo>)
                .filter(key => key in info)
                .map(key => ({
                    label: t(authorityFieldConfig[key]),
                    value: translateBooleanOrFormatValue(info[key], key.includes('authorityCommon')),
                })),
        [info],
    );

    return (
        <CollapsibleSection title={t('title')}>
            {authorityFields.map(({ label, value }, index) => (
                <DotLeader key={index} label={label} value={value} />
            ))}
            <DotLeader label={t('docket-number')} value={docketNumber} />
        </CollapsibleSection>
    );
};
