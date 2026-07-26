import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { classname } from '@utils';

import { CommonRouteProps } from '../../sidebar.types';
import { ItemBadgeCount } from '../item-badge-count';

const cn = classname('main-layout-sidebar');

export const CommonRoute = ({ href, subRoutes, as, icon, name, labelCountField }: CommonRouteProps) => {
    const { pathname } = useRouter();

    return (
        <Link
            key={`${name}-${href}`}
            href={href as string}
            as={as}
            className={cn('link', { active: href === pathname || !!subRoutes?.find(subRoute => subRoute === pathname) })}
        >
            {icon}
            <div className={cn('link-text')}>{name}</div>
            <ItemBadgeCount name={name} labelCountField={labelCountField} />
        </Link>
    );
};
