import React, { useCallback, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { ExportButton, PageHeader } from '@/components/common';
import { useOrdersActionsPermission, useOrdersExport } from '@/hooks/order';
import { OrderType } from '@enums';
import { translateByNamespace } from '@utils/i18n';
import { getAllAminOrdersFiltersFromUrlParams } from '@utils/orders/filters-helpers';
import { getProjectName } from '@utils/translate/get-project-name';

type Props = {
    ordersType: OrderType;
};

const t = translateByNamespace('admin:orders-page');

export const AdminOrdersPageHead = ({ ordersType }: Props) => {
    const hasOrdersActionsPermission = useOrdersActionsPermission();
    const [isExporting, setIsExporting] = useState<boolean>(false);
    const router = useRouter();

    const exportOrders = useOrdersExport();

    const exportOrdersHandler = useCallback(async () => {
        setIsExporting(true);
        const filters = getAllAminOrdersFiltersFromUrlParams(router.query);

        await exportOrders({ ...filters, type: ordersType });
        setIsExporting(false);
    }, [exportOrders, router.query, ordersType]);

    return (
        <>
            <Head>
                <title>{t('page-title', { projectName: getProjectName() })}</title>
            </Head>
            <PageHeader>
                {t('header')}
                {hasOrdersActionsPermission && <ExportButton onClick={exportOrdersHandler} disabled={isExporting} isLoading={isExporting} />}
            </PageHeader>
        </>
    );
};
