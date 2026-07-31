import React from 'react';

import { EmptyLayout, Paginate } from '@/components/common';
import { CompanyType } from '@/enums';
import { useQueryFilters, useTable } from '@hooks';
import { useGetCompaniesQuery } from '@store/api/company-api';
import { translateByNamespace } from '@utils/i18n';

import { CompanyInfoCard } from './company-info-card';

const t = translateByNamespace('admin:accounting:carriers');

export const CarriersAccountingList = () => {
    const { filters } = useQueryFilters();
    const { page } = filters;
    const { onPageChangeHandler } = useTable();

    const { data: carriersAccountingData, isSuccess } = useGetCompaniesQuery({ ...filters, type: CompanyType.CARRIER });

    if (!isSuccess) {
        return null;
    }

    if (carriersAccountingData?.data.length) {
        return (
            <>
                {carriersAccountingData.data.map(company => (
                    <CompanyInfoCard key={company.publicId} {...company} />
                ))}
                {carriersAccountingData.meta.lastPage && carriersAccountingData.meta.lastPage > 1 && (
                    <Paginate page={page} lastPage={carriersAccountingData.meta.lastPage} onChange={onPageChangeHandler} />
                )}
            </>
        );
    }

    return <EmptyLayout title={t('no-data-title', { user: t('header') })} subTitle={t('no-data-description')} />;
};
