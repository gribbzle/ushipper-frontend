import React from 'react';

import { classname } from '@utils/classname';

import { SidebarRouteProps } from '../sidebar.types';

import { CommonRoute } from './common-route/common-route';
import { RouteWithSubRoutes } from './route-with-subroutes/route-with-subroutes';

const cn = classname('main-layout-sidebar');

export const SidebarRoute = ({ route: { type, name, routes, href, icon, labelCountField, subRoutes, as } }: SidebarRouteProps) => {
    if (type === 'block') {
        return (
            <div key={`${type}-${name}`} className={cn('block')}>
                {name}
            </div>
        );
    }

    if (routes) {
        return <RouteWithSubRoutes name={name} href={href} icon={icon} routes={routes} />;
    }

    return <CommonRoute name={name} as={as} href={href} icon={icon} labelCountField={labelCountField} subRoutes={subRoutes} />;
};
