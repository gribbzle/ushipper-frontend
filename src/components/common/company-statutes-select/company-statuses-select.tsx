import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { CompanyStatusEnum } from '@/enums';
import {SelectField} from '@/fields/select-field';
import { getCompanyStatusTranslate } from '@utils/get-company-status-translate';

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
