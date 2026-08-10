import React, { useMemo } from 'react';

import { CollapsibleSection } from '@/components/common/collapsible-section/collapsible-section';
import { CompanyFMCSAInsuranceInfo, CompanyFMCSARecord } from '@store/api/company-api';
import { DotLeader } from '@/components/ui/data-display/dot-leader';
import { translateByNamespace } from '@utils/i18n';
import { formatToCurrency } from '@utils/numbers';
import { translateBooleanOrFormatValue } from '@utils/translations';

type Props = {
    info: CompanyFMCSARecord;
};

const generateInsuranceFieldConfig = (type: string) => ({
    [`insurance${type}Onfile`]: 'on-file',
    [`insurance${type}Required`]: 'required',
    [`insurance${type}RequiredAmount`]: 'required-amount',
});

const t = translateByNamespace('client:company-page:fmcsa-info:fields:insurance-group');

export const InsuranceBlock = ({ info }: Props) => {
    const insuranceTypes = useMemo(() => ['Bipd', 'Bond', 'Cargo'], []);

    const insuranceFields = useMemo(() => {
        return insuranceTypes.flatMap(type => {
            const config = generateInsuranceFieldConfig(type);

            return Object.entries(config).map(([key, labelKey]) => {
                const rawValue = info[key as keyof CompanyFMCSAInsuranceInfo];
                let value;

                if (key.includes('Onfile') || key.includes('RequiredAmount')) {
                    value = formatToCurrency(translateBooleanOrFormatValue(rawValue) as number);
                } else {
                    value = translateBooleanOrFormatValue(rawValue);
                }

                return {
                    label: t(labelKey, { type: type.toUpperCase() }),
                    value: value,
                };
            });
        });
    }, [info, insuranceTypes]);

    return (
        <CollapsibleSection title={t('title')}>
            {insuranceFields.map(({ label, value }, index) => (
                <DotLeader key={index} label={label} value={value} />
            ))}
        </CollapsibleSection>
    );
};
