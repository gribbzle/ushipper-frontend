import React from 'react';

import { AddFuelCardToDriverPopup } from '@/components/admin/fuel/cards/add-fuel-card-to-driver-popup/add-fuel-card-to-driver-popup';
import { EditFuelCardPopup } from '@/components/admin/fuel/cards/edit-fuel-card-popup/edit-fuel-card-popup';
import { FuelCardsFilters } from '@/components/admin/fuel/cards/fuel-cards-filters/fuel-cards-filters';
import { FuelCardsPageHead } from '@/components/admin/fuel/cards/cards-page-head/cards-page-head';
import { FuelCardsTable } from '@/components/admin/fuel/cards/cards-table/cards-table';
import { FuelPageLayout } from '@/components/admin/fuel/fuel-page-layout/fuel-page-layout';
import { getMainLayout } from '@/components/common/main-layout/main-layout';
import { UnassignDriverFromFuelCardPopup } from '@/components/admin/fuel/cards/unassign-fuel-card-from-driver-popup/unassign-fuel-card-from-driver-popup';

const FuelCardsPage = () => (
    <FuelPageLayout>
        <FuelCardsFilters />
        <FuelCardsTable />

        <AddFuelCardToDriverPopup />
        <UnassignDriverFromFuelCardPopup />
        <EditFuelCardPopup />
    </FuelPageLayout>
);

FuelCardsPage.getLayout = getMainLayout({
    head: <FuelCardsPageHead />,
    permissions: [{ scope: 'fuelCards', functionality: 'admin_panel.fuel_cards.cards.view_any' }],
});

export default FuelCardsPage;
