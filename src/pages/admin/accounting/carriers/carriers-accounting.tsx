import React, { useMemo } from 'react';
import { AccountingEntityFilters } from '@/components/admin/accounting/common/accounting-filters/accounting-entity-filters';
import { AccountingPageLayout } from '@/components/admin/accounting/common/accounting-page-layout/accounting-page-layout';
import { CarrierAccountingDrawer } from '@/components/admin/accounting/carriers/carrier-accounting-drawer/carrier-accounting-drawer';
import { CarriersAccountingList } from '@/components/admin/accounting/carriers/carriers-accounting-list/carriers-accounting-list';
import { CarriersAccountingPageHead } from '@/components/admin/accounting/carriers/carriers-accounting-page-head/carriers-accounting-page-head';
import { CreateEditCompanyDrawer } from '@/components/admin/companies/create-edit-company-drawer/create-edit-company-drawer';
import { DeleteCompanyPopup } from '@/components/admin/companies/delete-company-popup/delete-company-popup';
import { getMainLayout } from '@/components/common/main-layout/main-layout';
import { useCarriersActionsPermission, useCompaniesActionsPermission } from '@hooks';
import { PublicIdProvider } from '@/providers/PublicIdProvider';
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
