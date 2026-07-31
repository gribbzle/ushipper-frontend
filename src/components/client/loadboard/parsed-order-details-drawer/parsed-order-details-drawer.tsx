import React, { useMemo } from 'react';

import { LoadboardDrawerMap } from '@/components/client/loadboard/loadboard-drawer-map/loadboard-drawer-map';
import { Drawer } from '@/components/common/drawer/drawer';
import { LoadBoardFilters } from '@store/api/loadboard-api';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { ParsedOrderDetails } from './parsed-order-details';
import { useParsedOrderDetailsDrawer } from './use-parsed-order-details-drawer';

import './parsed-order-details-drawer.scss';

const cn = classname('parsed-order-details-drawer');
const t = translateByNamespace('client:loadboard:notifications');

export const ParsedOrderDetailsDrawer = ({ loadBoardFilters }: { loadBoardFilters?: LoadBoardFilters }) => {
    const { order, opened, title, onDrawerClose } = useParsedOrderDetailsDrawer();

    const body = useMemo(
        () =>
            order ? (
                <>
                    <ParsedOrderDetails loadBoardFilters={loadBoardFilters} order={order} />
                    <LoadboardDrawerMap pickupInformation={order.pickupInformation} deliveryInformation={order.deliveryInformation} />
                </>
            ) : (
                <span className={cn('no-order')}>{t('order-is-no-available-notification')}</span>
            ),
        [loadBoardFilters, order],
    );

    return <Drawer onTop={opened} size={order ? 'large' : 'common'} className={cn()} isOpen={opened} onClose={onDrawerClose} head={title} body={body} />;
};
