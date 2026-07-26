import React, { useMemo } from 'react';

import { CollapsibleSection } from '@/components';
import { CompanyFMCSACrashesInfo, CompanyFMCSARecord } from '@store/api/company-api';
import { DotLeader } from '@ui';
import { translateBooleanOrFormatValue, translateByNamespace } from '@utils';

type Props = {
    info: CompanyFMCSARecord;
};

const crashesFieldConfig = {
    crashesTotal: 'total',
    crashesTowaway: 'fatal',
    crashesFatal: 'injury',
    crashesInjury: 'towaway',
};

const t = translateByNamespace('client:company-page:fmcsa-info:fields:crashes-group');

export const CrashesBlock = ({ info }: Props) => {
    const crashesFields = useMemo(
        () =>
            (Object.keys(crashesFieldConfig) as Array<keyof CompanyFMCSACrashesInfo>)
                .filter(key => key in info)
                .map(key => ({
                    label: t(crashesFieldConfig[key]),
                    value: translateBooleanOrFormatValue(info[key]),
                })),
        [info],
    );

    return (
        <CollapsibleSection title={t('title')}>
            {crashesFields.map(({ label, value }, index) => (
                <DotLeader key={index} label={label} value={value} />
            ))}
        </CollapsibleSection>
    );
};
