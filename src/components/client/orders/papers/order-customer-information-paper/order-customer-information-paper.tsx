import React, { useCallback, useMemo } from 'react';
import has from 'has-values';

import { OrderCustomerInformationDrawer } from '@/components/client/orders/drawers/order-customer-information-drawer/order-customer-information-drawer';
import { OrderInformationList } from '@/components/client/orders/order-information-list/order-information-list';
import { ZoneButton } from '@/components/common/zone-button/zone-button';
import { useCanManageOrder } from '@/hooks/order';
import { useMeCarrier, useMeDriverRelated } from '@hooks';
import { useAppDispatch, useAppSelector } from '@store';
import { OrderCustomerInformation, orderCustomerInformationSelector, ordersActions } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { getObjectWithoutEmptyFields } from '@utils/objects';

import './order-customer-information-paper.scss';
const t = translateByNamespace('client:order:customer-information');
const cn = classname('customer-information-paper');

type FilledBlockProps = {
    onDrawerOpen: () => void;
    customerInformation: OrderCustomerInformation;
};

const FilledBlock = ({ onDrawerOpen, customerInformation }: FilledBlockProps) => {
    const isMeCarrier = useMeCarrier();
    const isDriver = useMeDriverRelated();

    const title = useMemo(() => (isDriver || isMeCarrier ? t('broker-title') : t('title')), [isDriver, isMeCarrier]);

    return (
        <div className={cn('')}>
            <span className={cn('title')}>{title}</span>
            <OrderInformationList
                fields={customerInformation}
                emptyNameLabel={isDriver || isMeCarrier ? t('broker-empty-name-label') : t('empty-name-label')}
                externalCompanyMcNumber={customerInformation.externalCompany?.mcNumber}
                onClick={onDrawerOpen}
            />
        </div>
    );
};

export const OrderCustomerInfo = () => {
    const dispatch = useAppDispatch();
    const customerInformation = useAppSelector(orderCustomerInformationSelector);

    const customerInformationIsNotEmpty = customerInformation && has(getObjectWithoutEmptyFields(customerInformation));
    const isMeCarrier = useMeCarrier();
    const canPerformActions = useCanManageOrder();

    const handleCustomerInformationDrawerOpen = useCallback(() => {
        dispatch(ordersActions.setCustomerInformationDrawerProps(Object.assign({ isVisible: true }, customerInformation)));
    }, [dispatch, customerInformation]);

    const title = useMemo((): string => {
        if (!canPerformActions) {
            return t('no-data-label', { type: t(isMeCarrier ? 'broker-title' : 'title') });
        }

        if (isMeCarrier) {
            return t('broker-empty-label');
        }

        return t('empty-label');
    }, [canPerformActions, isMeCarrier]);

    return (
        <>
            {canPerformActions && <OrderCustomerInformationDrawer />}
            {customerInformationIsNotEmpty ? (
                <FilledBlock onDrawerOpen={handleCustomerInformationDrawerOpen} customerInformation={customerInformation} />
            ) : (
                <div className={cn('')}>
                    <ZoneButton label={title} onClick={handleCustomerInformationDrawerOpen} disabled={!canPerformActions} />
                </div>
            )}
        </>
    );
};
