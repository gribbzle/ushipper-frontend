import { useMemo } from 'react';

import { useMeAdmin, useMeCarrierDriver, useMeDispatcher, useMeDriver, useMeShipper } from '@hooks';
import { isFreightX } from '@utils';

import { carrierRoutes, dispatcherRoutes, driverRoutes, freightXAdminRoutes, shipperRoutes, ushipperAdminRoutes } from '../routes';

import { useGetRoutes } from './use-get-routes';

export const useRoutes = () => {
    const getRoutes = useGetRoutes();

    const isAdminPage = useMeAdmin();
    const isDispatcherPage = useMeDispatcher();
    const isShipperPage = useMeShipper();
    const isDriverPage = useMeDriver();
    const isCarrierDriverPage = useMeCarrierDriver();

    const adminRoutes = isFreightX ? freightXAdminRoutes : ushipperAdminRoutes;

    const routes = useMemo(() => {
        switch (true) {
            case isAdminPage:
                return getRoutes(adminRoutes);
            case isDispatcherPage:
                return getRoutes(dispatcherRoutes);
            case isShipperPage:
                return getRoutes(shipperRoutes);
            case isCarrierDriverPage:
            case isDriverPage:
                return getRoutes(driverRoutes);
            default:
                return getRoutes(carrierRoutes);
        }
    }, [isAdminPage, getRoutes, adminRoutes, isDispatcherPage, isShipperPage, isCarrierDriverPage, isDriverPage]);

    return routes;
};
