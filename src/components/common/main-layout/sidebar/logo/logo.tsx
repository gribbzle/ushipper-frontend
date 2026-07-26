import React, { useMemo } from 'react';
import Link from 'next/link';

import { useMeAdmin, useMeCarrier, useMeDispatcher, useMeDriver, useMeShipper } from '@hooks';
import logos from '@logo';
import { classname } from '@utils';

const cn = classname('main-layout-sidebar');

const { LogoBlueMediumAdmin, LogoBlueMediumCarrier, LogoBlueMediumDispatcher, LogoBlueMediumDriver, LogoBlueMediumShipper } = logos;

export const Logo = () => {
    const isDispatcherPage = useMeDispatcher();
    const isCarrierPage = useMeCarrier();
    const isShipperPage = useMeShipper();
    const isAdminPage = useMeAdmin();
    const isDriverPage = useMeDriver();

    const logoLinkHref = useMemo(() => {
        if (isAdminPage) {
            return '/admin/orders/carrier';
        }

        return isDispatcherPage || isDriverPage ? '/client/dashboard' : '/client/orders';
    }, [isAdminPage, isDispatcherPage, isDriverPage]);

    const logoLinkAs = useMemo(() => {
        if (isAdminPage) {
            return '/admin/orders/carrier';
        }

        return isDispatcherPage || isDriverPage ? '/dashboard' : '/orders';
    }, [isAdminPage, isDispatcherPage, isDriverPage]);

    return (
        <Link href={logoLinkHref} as={logoLinkAs} className={cn('logo-container')}>
            {isCarrierPage && <LogoBlueMediumCarrier />}
            {isShipperPage && <LogoBlueMediumShipper />}
            {isAdminPage && <LogoBlueMediumAdmin />}
            {isDispatcherPage && <LogoBlueMediumDispatcher />}
            {isDriverPage && <LogoBlueMediumDriver />}
        </Link>
    );
};
