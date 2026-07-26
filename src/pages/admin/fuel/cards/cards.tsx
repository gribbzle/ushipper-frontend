import React from 'react';

import {
    AddFuelCardToDriverPopup,
    EditFuelCardPopup,
    FuelCardsFilters,
    FuelCardsPageHead,
    FuelCardsTable,
    FuelPageLayout,
    getMainLayout,
    UnassignDriverFromFuelCardPopup,
} from '@components';

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
