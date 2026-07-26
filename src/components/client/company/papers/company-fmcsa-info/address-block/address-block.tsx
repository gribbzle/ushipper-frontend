import React, { useMemo } from 'react';

import { CollapsibleSection } from '@/components';
import { CompanyFMCSAAddressInfo, CompanyFMCSARecord } from '@store/api/company-api';
import { DotLeader } from '@ui';
import { translateBooleanOrFormatValue, translateByNamespace } from '@utils';

type Props = {
    info: CompanyFMCSARecord;
};

const addressFieldConfig = {
    addressCountry: 'country',
    addressState: 'state',
    addressCity: 'city',
    addressStreet: 'street',
    addressZipcode: 'zip',
};

const t = translateByNamespace('client:company-page:fmcsa-info:fields:business-address-group');

export const AddressBlock = ({ info }: Props) => {
    const addressFields = useMemo(
        () =>
            (Object.keys(addressFieldConfig) as Array<keyof CompanyFMCSAAddressInfo>)
                .filter(key => key in info)
                .map(key => ({
                    label: t(addressFieldConfig[key]),
                    value: translateBooleanOrFormatValue(info[key]),
                })),
        [info],
    );

    return (
        <CollapsibleSection title={t('title')}>
            {addressFields.map(({ label, value }, index) => (
                <DotLeader key={index} label={label} value={value} />
            ))}
        </CollapsibleSection>
    );
};
