import React, { useMemo } from 'react';

import { CollapsibleSection } from '@/components/common/collapsible-section/collapsible-section';
import { CompanyFMCSACrashesInfo, CompanyFMCSARecord } from '@store/api/company-api';
import { DotLeader } from '@/components/ui/data-display/dot-leader';
import { translateByNamespace } from '@utils/i18n';
import { translateBooleanOrFormatValue } from '@utils/translations';

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
