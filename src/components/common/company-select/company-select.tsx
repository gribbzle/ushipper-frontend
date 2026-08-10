import React, { useEffect, useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import {SelectField} from '@/fields/select-field';
import { useAppDispatch, useAppSelector } from '@store';
import { fetchCompaniesAction, fetchedCompaniesSelector } from '@store/admin';
import { companiesActions } from '@store/admin/companies/slice';

export default function CompanySelect(props: FieldRenderProps<string>) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(companiesActions.setFilters({ type: props.companyType }));
        dispatch(fetchCompaniesAction());
    }, [dispatch, props.companyType]);

    const fetchedCompanies = useAppSelector(fetchedCompaniesSelector);

    const options = useMemo(() => {
        return fetchedCompanies.map(company => ({
            value: company.publicId,
            label: company.name,
        }));
    }, [fetchedCompanies]);

    return <SelectField options={options} {...props} />;
}
