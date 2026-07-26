import React, { useMemo } from 'react';
import { createPortal } from 'react-dom';

import OrderItemValidationPopup from '@/components/client/orders/order-item-validation-popup/order-item-validation-popup';
import ShipperOptionsDropdown from '@/components/client/orders/order-options-dropdown/shipper-options-dropdown';
import { OrderStatus } from '@/enums';
import { Button, OrderSendOfferToCarrierDrawer } from '@components';
import { Load } from '@store/client';
import { classname, translateByNamespace } from '@utils';

import { useShipperOrderActions } from './use-shipper-order-actions';

import '../order-item/order-item.scss';

const translateOrderItem = translateByNamespace('client:orders-page:order-item');
const translateActions = translateByNamespace('client:order-actions');
const cn = classname('order-item');
const offerItemCn = translateByNamespace('client:order-offers:item');

type Props = {
    order: Load;
    isOrderItemContext: boolean;
};

export const ShipperOrderActions = ({ order, isOrderItemContext }: Props) => {
    const {
        handleEditOrderClick,
        handleRestoreClick,
        cancelOfferHandler,
        openRequestsDrawer,
        upPostFromLoadBoard,
        postToLoadBoard,
        openOfferDrawer,
        onCloseValidationPopup,
        validationPopupOpen,
        errors,
    } = useShipperOrderActions(order, isOrderItemContext);

    const context = useMemo(() => (isOrderItemContext ? 'orderItem' : 'header'), [isOrderItemContext]);

    return (
        <div className={cn('actions')}>
            {!order.archivedAt && !order.deletedAt && order.status === OrderStatus.PENDING && order.latestOffer && (
                <Button size='small' onClick={cancelOfferHandler}>
                    {offerItemCn('cancel-offer')}
                </Button>
            )}
            {!order.archivedAt && !order.deletedAt && order.status === OrderStatus.NEW && (
                <Button size='small' view='primary' onClick={openOfferDrawer}>
                    {translateOrderItem('send-offer')}
                </Button>
            )}
            {!order.archivedAt && !order.deletedAt && order.status === OrderStatus.NEW && (
                <Button size='small' onClick={postToLoadBoard} className={`${context}-post-btn`}>
                    {translateOrderItem('post')}
                </Button>
            )}
            {!order.deletedAt && !isOrderItemContext && (
                <Button onClick={handleEditOrderClick} size='small' className={`${context}-edit-btn`}>
                    {translateActions('edit-button-title')}
                </Button>
            )}
            {!!order.deletedAt && (
                <Button size='small' onClick={handleRestoreClick}>
                    {translateActions('restore-title')}
                </Button>
            )}
            {!order.archivedAt && !order.deletedAt && order.status === OrderStatus.POSTED && (
                <>
                    <Button onClick={openRequestsDrawer} badgeText={order.countOfNewRequests.toString()} size='small'>
                        {translateOrderItem('requests')}
                    </Button>
                    <Button size='small' onClick={upPostFromLoadBoard} className={`${context}-unpost-btn`}>
                        {translateOrderItem('unpost')}
                    </Button>
                </>
            )}
            {!order.deletedAt && <ShipperOptionsDropdown order={order} showMoreBtn={!isOrderItemContext} itemsContext={isOrderItemContext} />}
            {!order.deletedAt && isOrderItemContext && (
                <Button onClick={handleEditOrderClick} size='small'>
                    {translateActions('edit-button-title')}
                </Button>
            )}

            {isOrderItemContext ? (
                <OrderItemValidationPopup
                    isOpened={validationPopupOpen}
                    errors={errors}
                    onClose={onCloseValidationPopup}
                    navigateToOrder={handleEditOrderClick}
                />
            ) : (
                createPortal(
                    <OrderItemValidationPopup
                        isOpened={validationPopupOpen}
                        errors={errors}
                        onClose={onCloseValidationPopup}
                        navigateToOrder={handleEditOrderClick}
                    />,
                    document.body,
                )
            )}
            {!isOrderItemContext && createPortal(<OrderSendOfferToCarrierDrawer />, document.body)}
        </div>
    );
};
