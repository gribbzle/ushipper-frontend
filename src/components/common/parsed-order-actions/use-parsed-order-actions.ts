import { MouseEvent, useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { useCancelRequest, useCreateEmptyRequest, useLoadboardItemActions, useSendRequestAction } from '@/components/client/loadboard/loadboard-item/hooks';
import { DropdownOption } from '@/components/common/dropdown/dropdown';
import { OrderSourcesEnum } from '@/enums/order-sources-enum';
import { OrderStatus } from '@/enums/order-status';
import { RequestStatusesEnum } from '@/enums/request-statuses';
import { UserOrderStatus } from '@/enums/user-order-status-enum';
import { useCreateParsedOrderCall, useMeDriverRelated, useOpenParsedOrderDetailsDrawer } from '@hooks';
import { useAppDispatch, useAppSelector } from '@store';
import loadboardApi, { LoadBoardFilters } from '@store/api/loadboard-api';
import { usePartiallyUpdateOrderMutation } from '@store/api/orders-api';
import { accountsUsersSelector } from '@store/client/accounts';
import { loadboardActions } from '@store/client/loadboard';
import { Load } from '@store/common';
import { authorizedUserNameSelector } from '@store/global';
import { translateByNamespace } from '@utils/i18n';

import { useHandleCheckContract } from './use-handle-check-contract';
import { useHandleCheckSDOffer } from './use-handle-check-sd-offer';

const t = translateByNamespace('client:loadboard:item');
const tNotification = translateByNamespace('client:loadboard:notifications');
const tNotice = translateByNamespace('client:loadboard:notice');
const tFlag = translateByNamespace('client:orders-page:order-options-dropdown');

type Props = {
    order: Load;
    loadBoardFilters: LoadBoardFilters;
};

export const useParsedOrderActions = ({ order, loadBoardFilters }: Props) => {
    const { latestRequest, publicId, isFlagged, userOrderStatus, status, source, driverRequests } = order;

    const router = useRouter();
    const dispatch = useAppDispatch();
    const isDriver = useMeDriverRelated();

    const fetchedAccounts = useAppSelector(accountsUsersSelector);
    const authorizedUserName = useAppSelector(authorizedUserNameSelector);

    const [isChoosePhoneForCallPopupOpened, setIsChoosePhoneForCallPopupOpened] = useState(false);

    const [partiallyUpdateOrder] = usePartiallyUpdateOrderMutation();

    const { handleParsedOrderClick } = useOpenParsedOrderDetailsDrawer();
    const handleCheckContract = useHandleCheckContract(order, loadBoardFilters);
    const handleCheckSDOffer = useHandleCheckSDOffer(order, loadBoardFilters);
    const { createEmptyRequest } = useCreateEmptyRequest();
    const { handleMarkOrderAsFlaggedClick, handleMarkOrderAsUnFlaggedClick, isMeDriver } = useLoadboardItemActions({ order, loadBoardFilters });
    const createParsedOrderCall = useCreateParsedOrderCall();

    const publicRequestId = driverRequests && driverRequests.length > 0 ? driverRequests[0]?.publicId : undefined;
    const { handleCancelRequest } = useCancelRequest({ publicOrderId: publicId, publicRequestId });

    const isSendRequest = useMemo<boolean>(
        () => !driverRequests || driverRequests.every(request => request.status === RequestStatusesEnum.CANCELED),
        [driverRequests],
    );

    const isSuperDispatchOrder = source === OrderSourcesEnum.SUPER_DISPATCH_PARSED;

    const isDriverRequestInfo = useMemo(() => latestRequest && isDriver, [isDriver, latestRequest]);

    const showCheckContractButton = useMemo(
        () => userOrderStatus === UserOrderStatus.CALLED && status == OrderStatus.POSTED && !isSuperDispatchOrder,
        [isSuperDispatchOrder, userOrderStatus, status],
    );

    const showCheckSDOfferButton = useMemo(
        () =>
            isSuperDispatchOrder &&
            userOrderStatus !== UserOrderStatus.BOOKED &&
            status == OrderStatus.POSTED &&
            latestRequest &&
            latestRequest.creator.name === authorizedUserName,
        [authorizedUserName, isSuperDispatchOrder, latestRequest, status, userOrderStatus],
    );

    const showCallButton = useMemo(
        () => (userOrderStatus === UserOrderStatus.DECLINED || !userOrderStatus) && !isSuperDispatchOrder,
        [isSuperDispatchOrder, userOrderStatus],
    );

    const showSDRequestButton = useMemo(
        () =>
            isSuperDispatchOrder &&
            userOrderStatus !== UserOrderStatus.BOOKED &&
            (!latestRequest || (latestRequest && latestRequest.creator.name !== authorizedUserName)),
        [authorizedUserName, isSuperDispatchOrder, latestRequest, userOrderStatus],
    );

    const handleSendRequest = useCallback(() => {
        if (isMeDriver && fetchedAccounts?.length === 1) {
            dispatch(loadboardActions.setLoadboardNoticePopup({ opened: true, description: tNotice('description') }));

            return;
        }
        createEmptyRequest(publicId);
    }, [isMeDriver, fetchedAccounts?.length, createEmptyRequest, publicId, dispatch]);

    const handleOpenOrder = useCallback(() => {
        if (order.carrierOrder?.publicId) {
            router.push(
                {
                    pathname: '/client/orders/[order-id]',
                    query: {
                        ['order-id']: order.carrierOrder?.publicId,
                    },
                },
                `/orders/${order.carrierOrder?.publicId}`,
            );
        }
    }, [router, order]);

    const handleDeclinedOrder = useCallback(async () => {
        try {
            await partiallyUpdateOrder({ publicOrderId: publicId, newOrderData: { status: OrderStatus.DECLINED } }).unwrap();

            dispatch(
                loadboardApi.util.updateQueryData('getLoadboardItems', { filters: loadBoardFilters }, items => {
                    items.data = items.data.filter(item => {
                        if (item.publicId === publicId) {
                            if (loadBoardFilters?.hasCalledUserOrderStatus === 1) {
                                return false;
                            } else {
                                item.userOrderStatus = UserOrderStatus.DECLINED;
                            }
                        }

                        return true;
                    });
                }),
            );

            toast.success<string>(tNotification('order-declined-success'));
        } catch {
            toast.error<string>(tNotification('order-declined-error'));
        }
    }, [partiallyUpdateOrder, dispatch, loadBoardFilters, publicId]);

    const showMarkAsCalledOption =
        !isDriver && !userOrderStatus && (source === OrderSourcesEnum.CENTRAL_DISPATCH_PARSED || source === OrderSourcesEnum.CENTRAL_DISPATCH);

    const options: DropdownOption[] = useMemo(
        () => [
            // TODO update after backend is ready
            // {
            //     label: t('mark-as-out-date-order'),
            //     onClick: handleMarkAsOutDate,
            //     show: !isDriver,
            // },
            {
                label: t('mark-as-called-order'),
                onClick: () => createParsedOrderCall(publicId, loadBoardFilters),
                show: showMarkAsCalledOption,
            },
            {
                label: t('call'),
                onClick: () => setIsChoosePhoneForCallPopupOpened(true),
                show: userOrderStatus === UserOrderStatus.CALLED || userOrderStatus === UserOrderStatus.BOOKED,
            },
            {
                label: t('mark-as-declined-order'),
                onClick: handleDeclinedOrder,
                show: userOrderStatus !== UserOrderStatus.DECLINED && !isDriver,
            },
            {
                label: t('view-details-order'),
                onClick: () => handleParsedOrderClick(order.publicId),
            },
            {
                label: tFlag('flag-option'),
                onClick: handleMarkOrderAsFlaggedClick,
                show: !isFlagged,
            },
            { label: tFlag('unflag-option'), onClick: handleMarkOrderAsUnFlaggedClick, show: isFlagged },
        ],
        [
            showMarkAsCalledOption,
            userOrderStatus,
            publicId,
            isFlagged,
            order,
            loadBoardFilters,
            isDriver,
            handleDeclinedOrder,
            handleMarkOrderAsFlaggedClick,
            handleMarkOrderAsUnFlaggedClick,
            createParsedOrderCall,
            handleParsedOrderClick,
        ],
    );

    const { sendRequest } = useSendRequestAction(order);

    const handleRequestSuperDispatchOrder = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();

            sendRequest();
        },
        [sendRequest],
    );

    return {
        options,
        isMeDriver,
        isSendRequest,
        isDriver,
        isDriverRequestInfo,
        showCheckSDOfferButton,
        showCheckContractButton,
        showCallButton,
        showSDRequestButton,
        isSuperDispatchOrder,
        isChoosePhoneForCallPopupOpened,
        setIsChoosePhoneForCallPopupOpened,
        handleOpenOrder,
        handleSendRequest,
        handleCancelRequest,
        handleCheckContract,
        handleCheckSDOffer,
        handleRequestSuperDispatchOrder,
    };
};
