import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { SelectField } from '@fields';
import { useGetFuelCardCompaniesQuery } from '@store/api/fuel-card-companies-api';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('common:field');

export const FuelCardCompaniesSelect = ({ placeholder, ...props }: FieldRenderProps<string>) => {
    const { data: companies = [], isLoading } = useGetFuelCardCompaniesQuery();

    const options = useMemo(
        () =>
            companies?.map(company => ({
                label: company,
                value: company,
            })),
        [companies],
    );

    return <SelectField options={options} isLoading={isLoading} placeholder={placeholder ?? t('all-placeholder')} {...props} />;
};
