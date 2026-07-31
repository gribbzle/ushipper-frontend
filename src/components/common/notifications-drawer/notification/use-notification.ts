import { useCallback, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { OfferTabsEnum } from '@/components/client/offers/offer-drawer/offer-drawer';
import { OrderSourcesEnum } from '@/enums';
import { useRedirectToOrder } from '@/hooks/order';
import { formatToCurrency } from '@/utils/numbers';
import { useMeCarrier, useMeShipper, useTimeoutManager } from '@hooks';
import { useAppDispatch } from '@store';
import {
    changeNotificationStatusAction,
    deleteNotificationAction,
    DriverLowBalanceNotificationPayload,
    notificationsActions,
    OfferRequestNotificationPayload,
    OrderNotificationPayload,
} from '@store/common/notifications';
import { translateByNamespace } from '@utils/i18n';

import { NotificationProps } from './notification.types';

const t = translateByNamespace('common:notifications');

export const useNotification = (props: NotificationProps) => {
    const { payload, type, createdAt, readAt, id, pinnedAt, activeTab } = props;

    const dispatch = useAppDispatch();
    const itemRef = useRef<HTMLDivElement | null>(null);
    const [isDeleted, setIsDeleted] = useState<boolean>(false);
    const isCarrier = useMeCarrier();
    const isShipper = useMeShipper();

    const orderId = useMemo(() => {
        if (type === 'order_offer_created') {
            return (payload as OfferRequestNotificationPayload).orderOffer.order.orderId;
        }

        const payloadOrder = payload as OrderNotificationPayload;

        if (type === 'order_cancelled' && !isShipper) {
            return payloadOrder?.order?.carrierOrder?.orderId ?? t('notification-content.no-order-id');
        }

        return payloadOrder?.order?.orderId;
    }, [type, payload, isShipper]);

    const orderPublicId = useMemo(() => {
        if (type === 'order_offer_created') {
            return (payload as OfferRequestNotificationPayload).orderOffer.order.publicId;
        }
        if (type === 'order_cancelled' && !isShipper) {
            return (payload as OrderNotificationPayload).order.carrierOrder.publicId;
        } else {
            return (payload as OrderNotificationPayload)?.order?.publicId;
        }
    }, [type, payload, isShipper]);

    const content = useMemo(() => {
        const supportedTypes = [
            'order_picked_up',
            'order_restored',
            'order_renewed',
            'order_put_on_hold',
            'order_posted',
            'order_pending',
            'order_driver_updated',
            'order_delivered',
            'order_driver_deleted',
            'driver_added_to_order',
            'order_accepted',
            'order_created',
            'order_declined',
            'order_deleted',
            'order_archived',
            'order_unarchived',
            'order_cancelled',
            'external_contract_found',
            'external_signed_contract_updated',
            'external_imported_order_updated',
        ];

        if (type && supportedTypes.includes(type)) {
            return t(`notification-content.${type}`, { orderId });
        }

        if (type === 'driver_low_balance') {
            const payloadDriverLowBalance = payload as DriverLowBalanceNotificationPayload;

            return t(`notification-content.${type}`, { limit: formatToCurrency(payloadDriverLowBalance.minimalLimit) });
        }

        if (type === 'order_offer_created' && !isCarrier) {
            const payloadOffer = payload as OfferRequestNotificationPayload;

            return t(`notification-content.${type}`, { companyName: payloadOffer.orderOffer.carrierCompany.name });
        }
        if (type === 'order_offer_created' && isCarrier) {
            return t('notification-content.order_offer_created_carrier');
        }

        if ((type === 'order_request_created' || type === 'order_request_canceled') && isShipper) {
            const payloadRequest = payload as OfferRequestNotificationPayload;

            return t(`notification-content.${type}`, { companyName: payloadRequest.orderRequest.order.carrierCompany.name });
        }

        if ((type === 'order_request_created' || type === 'order_request_canceled') && !isShipper) {
            const payloadRequest = payload as OfferRequestNotificationPayload;
            const { order, type: requestType } = payloadRequest.orderRequest;

            if (order?.source === OrderSourcesEnum.USHIPPER && requestType === 'company_to_company') {
                return t(`notification-content.ushipper_${type}`, { companyName: order.company.name });
            }

            return t(`notification-content.driver_${type}`);
        }

        if (type === 'user_reset_password') {
            return t('notification-content.user_reset_password');
        }

        return '';
    }, [orderId, type, payload, isCarrier, isShipper]);

    const createdAtTime = useMemo(() => new Date(createdAt).toLocaleTimeString().substring(0, 5), [createdAt]);

    const setTimer = useTimeoutManager();

    const onPinHanlder = useCallback(() => {
        dispatch(changeNotificationStatusAction({ notificationPublicId: id, status: pinnedAt ? 'read' : 'pinned' })).then(() => {
            if (activeTab === 'pinned') {
                setIsDeleted(true);

                setTimer(id, () => dispatch(notificationsActions.removeNotificationById(id)));
            }

            const message = t(pinnedAt ? 'notification-was-unpinned-message' : 'notification-was-pinned-message');

            toast.success(message);
        });
    }, [activeTab, dispatch, setTimer, id, pinnedAt]);

    const onReadHandler = useCallback(() => {
        dispatch(changeNotificationStatusAction({ notificationPublicId: id, status: readAt ? 'unread' : 'read' })).then(() => {
            if (activeTab === 'unread' || activeTab === 'read') {
                setIsDeleted(true);

                setTimer(id, () => dispatch(notificationsActions.removeNotificationById(id)));
            }

            const message = t(readAt ? 'notification-was-marked-as-read-message' : 'notification-was-marked-as-unread-message');

            toast.success(message);
        });
    }, [activeTab, dispatch, setTimer, id, readAt]);

    const markAsReadSilently = useCallback(() => {
        if (!readAt && (activeTab === 'unread' || !activeTab)) {
            dispatch(changeNotificationStatusAction({ notificationPublicId: id, status: 'read' }));
        }
    }, [readAt, activeTab, id, dispatch]);

    const onDeleteHandler = useCallback(() => {
        dispatch(deleteNotificationAction(id))
            .then(() => {
                setIsDeleted(true);

                setTimer(id, () => dispatch(notificationsActions.removeNotificationById(id)));

                const message = t('notification-was-deleted');

                toast.success(message);
            })
            .then();
    }, [dispatch, id, setTimer]);

    const router = useRouter();
    const { query } = router;

    const { redirectToOrders } = useRedirectToOrder({
        publicId: orderPublicId,
    });
    const onOpenOrderHandler = useCallback(async () => {
        if (query['order-id'] === orderPublicId) {
            dispatch(notificationsActions.setIsDrawerOpen(false));

            return;
        }

        await redirectToOrders();
    }, [dispatch, orderPublicId, query, redirectToOrders]);

    const isNotificationForParsedOrder = type === 'external_contract_found' || type === 'external_signed_contract_updated';

    const onOpenLoadboardOrderHandler = useCallback(async () => {
        let drawerParsedOrderId = '';

        if (isNotificationForParsedOrder) {
            drawerParsedOrderId = orderPublicId;
        } else {
            const payload = props.payload as OfferRequestNotificationPayload;
            const { source, publicId } = payload.orderRequest.order;

            drawerParsedOrderId = publicId;

            if (source === OrderSourcesEnum.USHIPPER) {
                if (isShipper) {
                    const newQuery = { requestsOrderId: publicId };

                    await router.push({ pathname: '/client/shipper-requests', query: newQuery }, { pathname: '/shipper-requests', query: newQuery });
                } else {
                    const newQuery = { tab: 'requested' };

                    await router.push({ pathname: '/client/loadboard', query: newQuery }, { pathname: '/available-orders', query: newQuery });
                }

                dispatch(notificationsActions.setIsDrawerOpen(false));

                return;
            }
        }

        const newQuery = { drawerParsedOrderId };

        await router.push({ pathname: '/client/loadboard', query: newQuery }, { pathname: '/available-orders', query: newQuery });
    }, [isNotificationForParsedOrder, router, orderPublicId, isShipper, props.payload, dispatch]);

    const openOfferDrawerHandler = useCallback(async () => {
        const payload = props.payload as OfferRequestNotificationPayload;
        const path = `offers?drawerOfferId=${payload.orderOffer?.publicId}&drawerTab=${OfferTabsEnum.details}`;

        await router.push(`/client/${path}`, path);
    }, [props.payload, router]);

    const openViewJobOfferDrawerHandler = useCallback(async () => {
        const payload = props.payload as OfferRequestNotificationPayload;
        const path = `job-offers?drawerJobOfferId=${payload.jobOffer?.publicId}&tab=${OfferTabsEnum.details}`;

        await router.push(`/client/${path}`, path);
    }, [props.payload, router]);

    const showOpenLoadboardOrderButton = useMemo(
        () => type === 'order_request_created' || type === 'order_request_canceled' || isNotificationForParsedOrder,
        [isNotificationForParsedOrder, type],
    );

    return {
        isCarrier,
        itemRef,
        isDeleted,
        content,
        createdAtTime,
        showOpenLoadboardOrderButton,
        openViewJobOfferDrawerHandler,
        openOfferDrawerHandler,
        onOpenLoadboardOrderHandler,
        onOpenOrderHandler,
        onDeleteHandler,
        markAsReadSilently,
        onReadHandler,
        onPinHanlder,
    };
};
