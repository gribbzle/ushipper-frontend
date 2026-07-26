import React, { useMemo } from 'react';

import {
    AccountingEntityFilters,
    AccountingPageLayout,
    CarrierAccountingDrawer,
    CarriersAccountingList,
    CarriersAccountingPageHead,
    CreateEditCompanyDrawer,
    DeleteCompanyPopup,
    getMainLayout,
} from '@components';
import { useCarriersActionsPermission, useCompaniesActionsPermission } from '@hooks';
import { PublicIdProvider } from '@providers';
import { useAppSelector } from '@store';
import { carrierAccountingDrawerPropsSelector } from '@store/admin';

const CarriersAccountingPage = () => {
    const hasCompaniesActionsPermission = useCompaniesActionsPermission();
    const hasCarriersActionsPermission = useCarriersActionsPermission();
    const { companyId } = useAppSelector(carrierAccountingDrawerPropsSelector);

    const showDrawer = useMemo(() => hasCarriersActionsPermission && !!companyId, [hasCarriersActionsPermission, companyId]);

    return (
        <AccountingPageLayout>
            <AccountingEntityFilters />
            <CarriersAccountingList />
            {hasCompaniesActionsPermission && (
                <>
                    <CreateEditCompanyDrawer />
                    <DeleteCompanyPopup />
                </>
            )}
            {showDrawer && companyId && (
                <PublicIdProvider value={companyId}>
                    <CarrierAccountingDrawer />
                </PublicIdProvider>
            )}
        </AccountingPageLayout>
    );
};

CarriersAccountingPage.getLayout = getMainLayout({
    head: <CarriersAccountingPageHead />,
    permissions: [{ scope: 'adminPanelAccounting', functionality: 'admin_panel.carriers.view_any' }],
});

export default CarriersAccountingPage;
