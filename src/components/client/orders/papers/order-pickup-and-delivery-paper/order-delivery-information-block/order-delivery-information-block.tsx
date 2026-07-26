import React, { useCallback, useMemo } from 'react';
import has from 'has-values';

import { OrderDeliveryInformationDrawer, OrderInformationList, ZoneButton } from '@/components';
import { useCanManageOrder } from '@/hooks/order';
import { useAppDispatch, useAppSelector } from '@store';
import { orderDeliveredAtSelector, orderDeliveryInformationSelector, ordersActions } from '@store/client';
import { getObjectWithoutEmptyFields, translateByNamespace } from '@utils';

const t = translateByNamespace('client:order:delivery-information');

export const OrderDeliveryInformationBlock = () => {
    const dispatch = useAppDispatch();
    const deliveryInformation = useAppSelector(orderDeliveryInformationSelector);
    const deliveredAt = useAppSelector(orderDeliveredAtSelector);
    const canPerformActions = useCanManageOrder();

    const handleDeliveryInformationDrawerOpen = useCallback(() => {
        if (!canPerformActions) return;
        dispatch(ordersActions.setDeliveryInformationDrawerProps(Object.assign({ isVisible: true }, deliveryInformation)));
    }, [dispatch, deliveryInformation, canPerformActions]);

    const title = useMemo((): string => (canPerformActions ? t('empty-label') : t('no-data-label')), [canPerformActions]);

    return (
        <>
            {canPerformActions && <OrderDeliveryInformationDrawer />}
            {!deliveryInformation || !has(getObjectWithoutEmptyFields(deliveryInformation)) ? (
                <ZoneButton label={title} onClick={handleDeliveryInformationDrawerOpen} disabled={!canPerformActions} />
            ) : (
                <OrderInformationList
                    title={t('title-label')}
                    emptyNameLabel={t('empty-name-label')}
                    fields={deliveryInformation}
                    deliveredAt={deliveredAt}
                    deliveredAtTimezone={deliveryInformation.timezone}
                    onClick={handleDeliveryInformationDrawerOpen}
                />
            )}
        </>
    );
};
