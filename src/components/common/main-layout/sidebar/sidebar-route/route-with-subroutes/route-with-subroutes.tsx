import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { classname } from '@utils';

import { ArrowIcon } from '../../icons';
import { RouteWithSubRoutesProps } from '../../sidebar.types';
import { ItemBadgeCount } from '../item-badge-count';

const cn = classname('main-layout-sidebar');

export const RouteWithSubRoutes = ({ href, routes, icon, name }: RouteWithSubRoutesProps) => {
    const [isSubRoutesOpened, setIsSubRoutesOpened] = useState<boolean>(false);
    const { pathname } = useRouter();

    const toggleIsOpen = useCallback(() => {
        setIsSubRoutesOpened(state => !state);
    }, []);

    useEffect(() => {
        if (routes) {
            const doesPathIncludeSubRoute = routes?.some(subRoute => pathname.includes(subRoute.href));

            if (doesPathIncludeSubRoute) {
                setIsSubRoutesOpened(true);
            }
        }
    }, [pathname, routes]);

    return (
        <div key={`${name}-${href}`} className={cn('group', { open: isSubRoutesOpened })}>
            <div className={cn('link')} onClick={() => toggleIsOpen()}>
                {icon}
                <div className={cn('link-text')}>{name}</div>
                <ArrowIcon className={cn('group-arrow')} />
            </div>
            {routes?.map(({ name, href, as, labelCountField }) => (
                <Link key={`${name}-${href}`} href={href} as={as} className={cn('link', { active: href === pathname, sub: true })}>
                    <div className={cn('link-text')}>• {name}</div> <ItemBadgeCount name={name} labelCountField={labelCountField} />
                </Link>
            ))}
        </div>
    );
};
