import React, { useCallback, useMemo } from 'react';
import has from 'has-values';

import { useCanManageOrder } from '@/hooks/order';
import { useDisableProductChanging } from '@/hooks/order/use-disable-product-changing';
import { AlertBlock, Button, DeleteOrderVehiclePopup, OrderVehicleDrawer, ZoneButton } from '@components';
import { useMeShipper } from '@hooks';
import { PlusIcon } from '@icons';
import { useAppDispatch } from '@store';
import { OrderVehicle } from '@store/api/orders-api';
import { ordersActions } from '@store/common';
import { classname, translateByNamespace, translateCompanyType } from '@utils';

import { VehicleItem } from './vehicle-item';

import './order-vehicles-paper.scss';

const t = translateByNamespace('client:order:vehicles');
const cn = classname('vehicles-paper');

type FilledBlockProps = {
    vehicles: OrderVehicle[];
    onAddVehicleClick: () => void;
};

const FilledBlock = ({ vehicles, onAddVehicleClick }: FilledBlockProps) => {
    const dispatch = useAppDispatch();

    const isDisabled = useDisableProductChanging();
    const isMeShipper = useMeShipper();
    const canPerformActions = useCanManageOrder();

    const handleDeleteVehicleClick = useCallback(
        (vehicle: OrderVehicle) => {
            dispatch(
                ordersActions.setDeleteOrderVehiclePopupProps({
                    isVisible: true,
                    vehicleId: vehicle.id,
                    vehicleMake: vehicle.make,
                    vehicleModel: vehicle.model,
                }),
            );
        },
        [dispatch],
    );

    const handleEditVehicleClick = useCallback(
        ({ id }: OrderVehicle) => {
            dispatch(ordersActions.setOrderVehicleDrawerProps({ isVisible: true, vehicleId: id }));
        },
        [dispatch],
    );

    const addBtn = useMemo(
        () =>
            !canPerformActions || isDisabled ? null : (
                <Button size='mini' onClick={onAddVehicleClick}>
                    <PlusIcon /> {t('add-btn-label')}
                </Button>
            ),
        [canPerformActions, isDisabled, onAddVehicleClick],
    );

    return (
        <div className={cn()}>
            <div className={cn('header')}>
                <span className={cn('vehicles-title')}>
                    <span>
                        {t('vehicle-column-title')} {has(vehicles.length) && <sup className={cn('counter')}>{vehicles.length}</sup>}
                    </span>
                    {addBtn}
                </span>
            </div>
            {vehicles.map(vehicle => (
                <VehicleItem
                    className={cn('row')}
                    vehicle={vehicle}
                    key={vehicle.id}
                    onDeleteVehicleClick={() => handleDeleteVehicleClick(vehicle)}
                    onEditVehicleClick={() => handleEditVehicleClick(vehicle)}
                />
            ))}
            {isDisabled && (
                <AlertBlock>
                    {isMeShipper
                        ? t('alert-block-text-shipper', { user: translateCompanyType('carrier') })
                        : t('alert-block-text-carrier', { user: translateCompanyType('shipper') })}
                </AlertBlock>
            )}
        </div>
    );
};

type Props = {
    vehicles: OrderVehicle[];
};
export const OrderVehiclesInfo = ({ vehicles }: Props) => {
    const dispatch = useAppDispatch();
    const canPerformActions = useCanManageOrder();

    const handleAddVehicleClick = useCallback(() => {
        dispatch(ordersActions.setOrderVehicleDrawerProps({ isVisible: true, vehicleId: null }));
    }, [dispatch]);

    const title = useMemo(() => (canPerformActions ? t('add-vehicles-text') : t('no-data-label')), [canPerformActions]);

    return (
        <>
            {vehicles && vehicles.length ? (
                <>
                    <FilledBlock vehicles={vehicles} onAddVehicleClick={handleAddVehicleClick} />
                    <DeleteOrderVehiclePopup />
                </>
            ) : (
                <ZoneButton label={title} onClick={handleAddVehicleClick} disabled={!canPerformActions} />
            )}
            {canPerformActions && <OrderVehicleDrawer />}
        </>
    );
};
