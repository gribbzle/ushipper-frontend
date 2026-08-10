import React, { useCallback, useMemo } from 'react';
import has from 'has-values';

import { OrderCommodityDrawer } from '@/components/client/orders/drawers/order-commodity-drawer/order-commodity-drawer';
import { DeleteOrderCommodityPopup } from '@/components/client/orders/popups/delete-order-commodity-popup/delete-order-commodity-popup';
import { AlertBlock } from '@/components/common/alert-block/alert-block';
import { Button } from '@/components/common/button/button';
import { ZoneButton } from '@/components/common/zone-button/zone-button';
import { useCanManageOrder } from '@/hooks/order';
import { useDisableProductChanging } from '@/hooks/order/use-disable-product-changing';
import { useMeShipper } from '@/hooks/use-user-role-group';
import { useAppDispatch } from '@store';
import { OrderCommodity } from '@store/api/orders-api';
import { ordersActions } from '@store/common';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { translateCompanyType } from '@utils/translations';

import { CommodityItem } from './commodity-item';

import './order-commodities-paper.scss';
import PlusIcon from '@/assets/icons/plus.svg';

const t = translateByNamespace('client:order:commodities');
const cn = classname('order-commodities-paper');

type FilledBlockProps = {
    commodities: OrderCommodity[];
    onAddCommodityClick: () => void;
};

const FilledBlock = ({ commodities, onAddCommodityClick }: FilledBlockProps) => {
    const dispatch = useAppDispatch();
    const isDisabled = useDisableProductChanging();
    const isMeShipper = useMeShipper();
    const canPerformActions = useCanManageOrder();

    const handleDeleteCommodityClick = useCallback(
        (commodity: OrderCommodity) => {
            const { publicId, name, description } = commodity;

            dispatch(
                ordersActions.setDeleteOrderCommodityPopupProps({
                    isVisible: true,
                    commodityId: publicId,
                    commodityDescription: description,
                    commodityName: name,
                }),
            );
        },
        [dispatch],
    );

    const handleEditCommodityClick = useCallback(
        ({ publicId }: OrderCommodity) =>
            dispatch(
                ordersActions.setOrderCommodityDrawerProps({
                    isVisible: true,
                    commodityId: publicId,
                }),
            ),
        [dispatch],
    );

    const showAddBtn = useMemo((): boolean => !canPerformActions || isDisabled, [canPerformActions, isDisabled]);

    return (
        <div className={cn()}>
            <div className={cn('header')}>
                <span className={cn('commodities-title')}>
                    <span>
                        {t('commodity-column-title')} {has(commodities.length) && <sup className={cn('counter')}>{commodities.length}</sup>}
                    </span>
                    {showAddBtn && (
                        <Button size='mini' onClick={onAddCommodityClick}>
                            <PlusIcon /> {t('add-btn-label')}
                        </Button>
                    )}
                </span>
            </div>
            {commodities.map(commodity => (
                <CommodityItem
                    commodity={commodity}
                    key={commodity.publicId}
                    onDeleteCommodityClick={() => handleDeleteCommodityClick(commodity)}
                    onEditCommodityClick={() => handleEditCommodityClick(commodity)}
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
    commodities: OrderCommodity[];
};

export const OrderCommoditiesInfo = ({ commodities }: Props) => {
    const canPerformActions = useCanManageOrder();
    const dispatch = useAppDispatch();

    const handleAddCommodityClick = useCallback(() => {
        dispatch(ordersActions.setOrderCommodityDrawerProps({ isVisible: true, commodityId: null }));
    }, [dispatch]);

    const title = useMemo((): string => (canPerformActions ? t('add-commodities-text') : t('no-data-label')), [canPerformActions]);

    return (
        <>
            {commodities && commodities.length ? (
                <>
                    <FilledBlock commodities={commodities} onAddCommodityClick={handleAddCommodityClick} />
                    <DeleteOrderCommodityPopup />
                </>
            ) : (
                <ZoneButton label={title} onClick={handleAddCommodityClick} disabled={!canPerformActions} />
            )}
            {canPerformActions && <OrderCommodityDrawer />}
        </>
    );
};
