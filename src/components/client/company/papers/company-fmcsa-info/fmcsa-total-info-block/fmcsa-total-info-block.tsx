import React, { useMemo } from 'react';

import { CompanyFMCSARecord, CompanyFMCSATotalInfo } from '@store/api/company-api';
import { DotLeader } from '@/components/ui/data-display/dot-leader';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { translateBooleanOrFormatValue } from '@utils/translations';

import './fmcsa-total-info-block.scss';

type Props = {
    info: CompanyFMCSARecord;
};

const totalFieldConfig = {
    allowedToOperate: 'allowed-to-operate',
    legalName: 'legal-name',
    ein: 'EIN',
    totalDrivers: 'total-drivers',
    totalPowerUnits: 'total-power-units',
};

const t = translateByNamespace('client:company-page:fmcsa-info:fields');
const cn = classname('total-info-block');

export const FMCSATotalInfoBlock = ({ info }: Props) => {
    const totalFields = useMemo(
        () =>
            (Object.keys(totalFieldConfig) as Array<keyof CompanyFMCSATotalInfo>)
                .filter(key => key in info)
                .map(key => ({
                    label: t(totalFieldConfig[key]),
                    value: translateBooleanOrFormatValue(info[key]),
                })),
        [info],
    );

    return (
        <div className={cn()}>
            {totalFields.map(({ label, value }, index) => (
                <DotLeader key={index} label={label} value={value} />
            ))}
        </div>
    );
};
