import { Route } from '../sidebar.types';

export const filterRoutes = (routes: Route[], excludedNames: string[]): Route[] => {
    return routes
        .filter(route => !excludedNames.includes(route.name))
        .map(route => {
            if (!route.routes) {
                return route;
            }

            const filteredSubroutes = route.routes.filter(subroute => !excludedNames.includes(subroute.name));

            const updatedPermissions = route.permissions?.filter(permission =>
                filteredSubroutes.some(subroute =>
                    subroute.permissions?.some(
                        subroutePermission => subroutePermission.scope === permission.scope && subroutePermission.functionality === permission.functionality,
                    ),
                ),
            );

            return {
                ...route,
                permissions: !!updatedPermissions?.length ? updatedPermissions : undefined,
                routes: filteredSubroutes.length > 0 ? filteredSubroutes : undefined,
            };
        });
};
