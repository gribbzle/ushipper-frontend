import React, { useCallback, useMemo } from 'react';

import { Button, Drawer, OrderSendInvoiceForm } from '@components';
import { EyeIcon, SendIcon } from '@icons';
import { useAppDispatch, useAppSelector } from '@store';
import { useCreateOrderInvoiceMutation, useLazyGetOrderInvoiceQuery } from '@store/api/order-invoice-api';
import { OrderFormEnum, ordersActions, orderSendInvoiceDrawerPropsSelector } from '@store/common';
import { classname, downloadFileUsingAnchorElement, translateByNamespace } from '@utils';

import './order-send-invoice-drawer.scss';

const t = translateByNamespace('client:orders-page:order-send-invoice-drawer');
const cn = classname('order-send-invoice-drawer');

export const OrderSendInvoiceDrawer = () => {
    const dispatch = useAppDispatch();
    const { isVisible, publicOrderId, customerName } = useAppSelector(orderSendInvoiceDrawerPropsSelector);
    const [getOrderInvoice] = useLazyGetOrderInvoiceQuery();
    const [createInvoice] = useCreateOrderInvoiceMutation();

    const handleClose = useCallback(() => {
        dispatch(ordersActions.setSendInvoiceDrawerProps({ isVisible: false, customerName: null, publicOrderId: null }));
    }, [dispatch]);

    const handleViewInvoiceClick = useCallback(async () => {
        if (publicOrderId) {
            try {
                const { publicId: invoiceId } = await createInvoice(publicOrderId).unwrap();
                const { attachment } = await getOrderInvoice({ publicOrderId, invoiceId }).unwrap();

                downloadFileUsingAnchorElement({ url: attachment.url, filename: attachment.name });
            } catch {}
        }
    }, [createInvoice, getOrderInvoice, publicOrderId]);

    const actions = useMemo(
        () => (
            <>
                <Button onClick={handleViewInvoiceClick}>
                    <EyeIcon /> {t('preview-action-button-label')}
                </Button>
                <Button view='primary' type='submit' form={OrderFormEnum.SEND_INVOICE}>
                    <SendIcon /> {t('send-action-button-label')}
                </Button>
            </>
        ),
        [handleViewInvoiceClick],
    );

    return (
        <Drawer
            className={cn()}
            isOpen={isVisible}
            onClose={handleClose}
            head={t('header')}
            body={<OrderSendInvoiceForm publicOrderId={publicOrderId} customerName={customerName} onAfterFormSubmit={handleClose} />}
            actions={actions}
        />
    );
};
