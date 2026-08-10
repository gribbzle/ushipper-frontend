import React from 'react';

import { Paginate } from '@/components/common/paginate/paginate';
import { useIsAdminPage } from '@/hooks/use-is-admin-page';
import { Load } from '@store/client';
import { PaginatedResponse } from '@utils/redux';

type OrdersPaginatorProps = {
    ordersPaginatedData?: PaginatedResponse<Load[]>;
    handlePageChange: (value: number) => void;
};

export const OrdersPaginator = ({ ordersPaginatedData, handlePageChange }: OrdersPaginatorProps) => {
    const isAdminPage = useIsAdminPage();

    const showPaginator = !isAdminPage && ordersPaginatedData && ordersPaginatedData.meta.lastPage !== 1;

    if (!showPaginator) {
        return null;
    }

    return <Paginate lastPage={ordersPaginatedData.meta.lastPage} page={ordersPaginatedData.meta.currentPage} onChange={handlePageChange} />;
};
