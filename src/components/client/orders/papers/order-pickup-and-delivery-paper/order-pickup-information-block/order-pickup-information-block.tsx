import React, { useCallback, useMemo } from 'react';
import has from 'has-values';

import { OrderPickupInformationDrawer } from '@/components/client/orders/drawers/order-pickup-information-drawer/order-pickup-information-drawer';
import { OrderInformationList } from '@/components/client/orders/order-information-list/order-information-list';
import { ZoneButton } from '@/components/common/zone-button/zone-button';
import { useCanManageOrder } from '@/hooks/order/use-can-manage-order';
import { useAppDispatch, useAppSelector } from '@store';
import { orderPickedUpAtSelector, orderPickupInformationSelector, ordersActions } from '@store/client';
import { translateByNamespace } from '@utils/i18n';
import { getObjectWithoutEmptyFields } from '@utils/objects';

const t = translateByNamespace('client:order:pickup-information');

export const OrderPickupInformationBlock = () => {
    const dispatch = useAppDispatch();
    const pickupInformation = useAppSelector(orderPickupInformationSelector);
    const pickedUpAt = useAppSelector(orderPickedUpAtSelector);

    const canPerformActions = useCanManageOrder();

    const handlePickupInformationDrawerOpen = useCallback(() => {
        if (!canPerformActions) return;
        dispatch(ordersActions.setPickupInformationDrawerProps(Object.assign({ isVisible: true }, pickupInformation)));
    }, [dispatch, pickupInformation, canPerformActions]);

    const title = useMemo((): string => (canPerformActions ? t('empty-label') : t('no-data-label')), [canPerformActions]);

    return (
        <>
            {!pickupInformation || !has(getObjectWithoutEmptyFields(pickupInformation)) ? (
                <ZoneButton label={title} onClick={handlePickupInformationDrawerOpen} disabled={!canPerformActions} />
            ) : (
                <OrderInformationList
                    title={t('title-label')}
                    emptyNameLabel={t('empty-name-label')}
                    fields={pickupInformation}
                    pickedUpAt={pickedUpAt}
                    pickedUpAtTimezone={pickupInformation.timezone}
                    onClick={handlePickupInformationDrawerOpen}
                />
            )}
            {canPerformActions && <OrderPickupInformationDrawer />}
        </>
    );
};
