import { useEffect } from 'react';
import { toast } from 'react-toastify';

import { OrderSortingDirection } from '@/enums';
import { useQueryFilters, useTable } from '@hooks';
import { GetAccountingAccountsParams, useGetAccountingAccountsQuery } from '@store/api/accounting-accounts-api';
import { convertToStringArray, translateByNamespace } from '@utils';

import { useOnRowClickHandler } from './use-on-row-click-handler';
import { useOwnersAndDriversColumns } from './use-owners-and-drivers-columns';

const INITIAL_FILTERS = {
    orderName: 'id',
    orderDirection: OrderSortingDirection.DESC,
};

const t = translateByNamespace('admin:accounting:notifications');

export const useOwnersAndDriversTable = () => {
    const { filters } = useQueryFilters<GetAccountingAccountsParams>(INITIAL_FILTERS);
    const { onOrderChangeHandler, onPageChangeHandler, onPerPageChangeHandler } = useTable();
    const { companyIds, ...otherFilters } = filters;

    const {
        data: driversAccountingData,
        isSuccess,
        isError,
    } = useGetAccountingAccountsQuery({ ...otherFilters, ...(companyIds ? { companyIds: convertToStringArray(companyIds) } : {}) });

    useEffect(() => {
        if (isError) {
            toast.error<string>(t('upload-drivers-error'));
        }
    }, [isError]);

    const { columns } = useOwnersAndDriversColumns();

    const onRowClickHandler = useOnRowClickHandler();

    return {
        filters,
        columns,
        driversAccountingData,
        isSuccess,
        onOrderChangeHandler,
        onPageChangeHandler,
        onPerPageChangeHandler,
        onRowClickHandler,
    };
};
