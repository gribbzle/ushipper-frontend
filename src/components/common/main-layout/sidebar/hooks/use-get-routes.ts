import { useCallback, useMemo } from 'react';

import { useCheckPermission, useIsPartnerCompany, useMeCarrierDriver } from '@hooks';
import { useAppSelector } from '@store';
import { accountsUsersSelector } from '@store/client/accounts';
import { translateByNamespace } from '@utils';

import { Route } from '../sidebar.types';

const t = translateByNamespace('common:sidebar');

const MANDATORY_ROUTE_NAMES_FOR_DRIVER_OWNER = ['loadboard-block-label', 'available-orders-tab-label'];

export const useGetRoutes = () => {
    const fetchedAccounts = useAppSelector(accountsUsersSelector);

    const isDriverOwner = useMemo(() => fetchedAccounts?.some(account => account.role?.type === 'driver_owner'), [fetchedAccounts]);
    const isPartner = useIsPartnerCompany();
    const isMeCarrierDriver = useMeCarrierDriver();

    const checkPermission = useCheckPermission();

    const getRoutes = useCallback(
        (routes: Route[]): Route[] => {
            return routes
                .filter(route => {
                    if (route.name === 'drivers-plan' && (!isPartner || isMeCarrierDriver)) {
                        return false;
                    }

                    if (route.name === 'black-list-tab-label' && isMeCarrierDriver) {
                        return false;
                    }

                    return (isDriverOwner && MANDATORY_ROUTE_NAMES_FOR_DRIVER_OWNER.includes(route.name)) || checkPermission(route.permissions);
                })
                .map(route => {
                    const translatedRoute: Route = {
                        ...route,
                        name: t(route.name),
                    };

                    if (route.routes) {
                        translatedRoute.routes = route.routes
                            .filter(
                                subroute =>
                                    (isDriverOwner && MANDATORY_ROUTE_NAMES_FOR_DRIVER_OWNER.includes(route.name)) || checkPermission(subroute.permissions),
                            )
                            .map(subroute => ({
                                ...subroute,
                                name: t(subroute.name),
                            }));
                    }

                    return translatedRoute;
                });
        },
        [checkPermission, isDriverOwner, isPartner, isMeCarrierDriver],
    );

    return getRoutes;
};
