import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { CompanyStatusEnum } from '@/enums';
import { SelectField } from '@fields';
import { getCompanyStatusTranslate } from '@utils';

export const CompanyStatusesSelect = (props: FieldRenderProps<string>) => {
    const options = useMemo(
        () =>
            Object.values(CompanyStatusEnum).map(companyStatus => ({
                label: getCompanyStatusTranslate(companyStatus),
                value: companyStatus,
            })),
        [],
    );

    return <SelectField {...props} options={options} />;
};
