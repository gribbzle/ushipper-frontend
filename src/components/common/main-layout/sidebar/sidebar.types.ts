import React from 'react';

import { SidebarCountsEnum } from '@/enums/sidebar-counts-enum';
import { Permission } from '@/hooks/use-check-permission';

export type Route = {
    name: string;
    labelCountField?: SidebarCountsEnum;
    type?: string;
    icon?: React.ReactNode;
    href?: string;
    as?: string;
    routes?: Subroute[];
    subRoutes?: string[];
    permissions?: Permission[];
};

export type Subroute = {
    name: string;
    href: string;
    as?: string;
    permissions?: Permission[];
    labelCountField?: SidebarCountsEnum;
};

export type SidebarRouteProps = {
    route: Route;
};

export type CommonRouteProps = Pick<Route, 'href' | 'subRoutes' | 'as' | 'icon' | 'name' | 'labelCountField'>;
export type RouteWithSubRoutesProps = Pick<Route, 'href' | 'routes' | 'icon' | 'name'>;
export type ItemBadgeCountProps = Pick<Route, 'name' | 'labelCountField'>;
