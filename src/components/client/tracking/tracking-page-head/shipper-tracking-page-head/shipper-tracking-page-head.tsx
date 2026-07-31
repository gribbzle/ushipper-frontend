import React, { useCallback } from 'react';

import { Button } from '@/components/common/button/button';
import { Link } from '@/components/common/link/link';
import { PageHeader } from '@/components/common/page-header/page-header';
import { NativeSwitch } from '@fields';
import { useMeDriverRelated } from '@hooks';
import { PlusIcon } from '@icons';
import { useAppDispatch, useAppSelector } from '@store';
import { isShipperOrdersListShownSelector, trackingActions } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './shipper-tracking-page-head.scss';

const cn = classname('shipper-tracking-page-head');
const t = translateByNamespace('client:tracking-page');
const tOrders = translateByNamespace('client:tracking-page:shipper-orders-list-paper');

export const ShipperTrackingPageHead = () => {
    const dispatch = useAppDispatch();
    const isDriver = useMeDriverRelated();
    const isOrdersListShown = useAppSelector(isShipperOrdersListShownSelector);

    const handleToggleIsOrdersListShown = useCallback(
        (value: boolean) => {
            if (value) {
                dispatch(trackingActions.resetSelectedTracking());
            }
            dispatch(trackingActions.setIsShipperOrdersListShown(value));
        },
        [dispatch],
    );

    return (
        <PageHeader className={cn()}>
            {t('header-title')}
            <NativeSwitch label={tOrders('title')} checked={isOrdersListShown} onChange={handleToggleIsOrdersListShown} />
            {!isDriver && (
                <Link href='/client/orders/create' as='/orders/create'>
                    <Button view='primary' plain={true} size='small'>
                        <PlusIcon /> {t('add-order-button-label')}
                    </Button>
                </Link>
            )}
        </PageHeader>
    );
};
