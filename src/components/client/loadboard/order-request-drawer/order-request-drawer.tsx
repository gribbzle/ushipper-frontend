import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { LoadboardDrawerMap } from '@/components/client/loadboard/loadboard-drawer-map/loadboard-drawer-map';
import { Drawer } from '@/components/common/drawer/drawer';
import { OrderSourcesEnum } from '@/enums/order-sources-enum';
import { useMeCarrier } from '@/hooks/use-user-role-group';
import { AppState } from '@store';
import { LoadBoardFilters } from '@store/api/loadboard-api';
import { loadboardActions } from '@store/client/loadboard/slice';
import { classname } from '@utils/classname';

import { ParsedOrderDetails } from '../parsed-order-details-drawer';

import { OrderDetails } from './order-details';
import { RequestForm } from './request-form';

import './order-request-drawer.scss';

const cn = classname('order-request-drawer');

export const OrderRequestDrawer = ({ loadBoardFilters }: { loadBoardFilters: LoadBoardFilters }) => {
    const dispatch = useDispatch();
    const isMeCarrier = useMeCarrier();
    const { order, opened, title, reverse } = useSelector((state: AppState) => state.client.loadboard.requestDrawer);

    const onDrawerClose = useCallback(() => {
        dispatch(
            loadboardActions.setRequestDrawer({
                opened: false,
                order: undefined,
                title: null,
                reverse: false,
            }),
        );
    }, [dispatch]);

    const body = useMemo(
        () =>
            order && (
                <>
                    <div className={cn('column', { reverse: reverse })}>
                        {isMeCarrier && <RequestForm order={order} callback={onDrawerClose} />}
                        {order.source === OrderSourcesEnum.USHIPPER ? (
                            <OrderDetails order={order} />
                        ) : (
                            <ParsedOrderDetails loadBoardFilters={loadBoardFilters} order={order} />
                        )}
                    </div>
                    <LoadboardDrawerMap pickupInformation={order.pickupInformation} deliveryInformation={order.deliveryInformation} />
                </>
            ),
        [isMeCarrier, loadBoardFilters, onDrawerClose, order, reverse],
    );

    return <Drawer size='large' className={cn()} isOpen={opened} onClose={onDrawerClose} head={title} body={body} />;
};
