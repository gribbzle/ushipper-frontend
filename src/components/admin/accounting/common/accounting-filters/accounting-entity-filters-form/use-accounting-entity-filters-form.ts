import { useRef } from 'react';
import { useRouter } from 'next/router';

import { CompanyType } from '@/enums';
import { useHandleFiltersChange, useIsCarriersAccountingBalancePage, useQueryFilters } from '@/hooks';
import { convertToStringArray } from '@utils/converter';

import { AccountingEntityFiltersFormState } from './accounting-filters-entity-form.types';

export const useAccountingEntityFiltersForm = () => {
    const { pathname } = useRouter();
    const isDriversPage = pathname.includes('drivers');
    const isCarriersAccountingPage = useIsCarriersAccountingBalancePage();

    const {
        filters: { name, phone, email, status, companyIds },
    } = useQueryFilters<AccountingEntityFiltersFormState>();

    const handleFiltersChange = useHandleFiltersChange<AccountingEntityFiltersFormState>({ resetPageOnChange: true });

    const initialValuesRef = useRef<AccountingEntityFiltersFormState>({
        name,
        phone,
        email,
        status,
        ...(isCarriersAccountingPage ? { type: CompanyType.CARRIER } : {}),
        ...(isDriversPage ? { companyIds: convertToStringArray(companyIds) } : {}),
    });

    const initialValues = initialValuesRef.current;

    return {
        initialValues,
        isDriversPage,
        isCarriersAccountingPage,
        handleFiltersChange,
    };
};
