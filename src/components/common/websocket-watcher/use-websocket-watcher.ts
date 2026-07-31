import { useCallback } from 'react';
import { camelKeys } from 'js-convert-case';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { OffersCountEvent, RequestCountEvent } from '@/components/common/websocket-watcher/types';
import { fetchChat } from '@api';
import { useMeCarrier, useMeShipper } from '@hooks';
import { useAppDispatch, useAppSelector } from '@store';
import { issuesApi } from '@store/api/issues-api';
import { ordersActions } from '@store/client';
import { chatsActions } from '@store/common';
import { globalActions, isDriverPayCounterInitSelector, isIssuesCounterInitSelector } from '@store/global';
import { translateByNamespace } from '@utils/i18n';

const tOrder = translateByNamespace('client:order:order-information');

export const useWebsocketWatcher = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const isDriverPayCounterInit = useAppSelector(isDriverPayCounterInitSelector);
    const isIssuesCounterInit = useAppSelector(isIssuesCounterInitSelector);

    const getChatInfoAction = async (chatId: string) => {
        try {
            const result = await fetchChat(chatId);

            dispatch(chatsActions.prependDrawersChats({ chat: result }));

            return result;
        } catch (error) {
            return console.log(error);
        }
    };

    const updateUnreadNotificationsCount = useCallback(
        (event: unknown) => {
            const preparedEvent = camelKeys(event, { recursive: true, recursiveInArray: true }) as { countOfUnreadNotifications: number };

            dispatch(globalActions.setUserUnreadNoficationsCount(preparedEvent.countOfUnreadNotifications));
        },
        [dispatch],
    );

    const handleOrderFromFileCreated = useCallback(
        async (event: unknown) => {
            const preparedEvent = camelKeys(event, { recursive: true, recursiveInArray: true }) as {
                orderId: string;
                success: boolean;
            };

            dispatch(ordersActions.setIsCreateOrderFromFileLoading(false));

            if (preparedEvent?.success && preparedEvent?.orderId) {
                toast.success(tOrder<string>('order-created-from-file'));

                if (document.visibilityState === 'visible') {
                    await router.push(`/client/orders/${preparedEvent.orderId}`, `/orders/${preparedEvent.orderId}`);
                }
            } else {
                toast.error(tOrder<string>('order-created-from-file-error'));
            }
        },
        [dispatch, router],
    );

    const updateDriverPaymentRequestsCount = useCallback(
        (event: unknown) => {
            if (isDriverPayCounterInit) {
                const preparedEvent = camelKeys(event, { recursive: true, recursiveInArray: true }) as { count: number };

                dispatch(globalActions.setDriverPaymentRequestsCounter(preparedEvent.count));
            }
        },
        [dispatch, isDriverPayCounterInit],
    );

    const updateIssuesCount = useCallback(
        (event: unknown) => {
            if (isIssuesCounterInit) {
                const preparedEvent = camelKeys(event, { recursive: true, recursiveInArray: true }) as { pending: number };

                dispatch(globalActions.setIssuesCounter(preparedEvent.pending));
                dispatch(issuesApi.util.invalidateTags([{ type: 'Issues', id: 'LIST' }]));
            }
        },
        [dispatch, isIssuesCounterInit],
    );

    const isCarrier = useMeCarrier();
    const isShipper = useMeShipper();
    const handleRequestCountChange = useCallback(
        (event: unknown) => {
            const formattedEvent = camelKeys(event, { recursive: true }) as RequestCountEvent;

            dispatch(globalActions.setCountOfNewRequests(formattedEvent.countOfNewRequests));
        },
        [dispatch],
    );

    const handleOffersCountChange = useCallback(
        (event: unknown) => {
            const formattedEvent = camelKeys(event, { recursive: true }) as OffersCountEvent;

            let offersCount = 0;

            if (isCarrier) {
                offersCount = formattedEvent.carrierCompany.countOfNewOffers;
            }
            if (isShipper) {
                offersCount = formattedEvent.shipperCompany.countOfNewOffers;
            }
            dispatch(globalActions.setCountOfNewOffers(offersCount));
        },
        [dispatch, isCarrier, isShipper],
    );

    return {
        handleOffersCountChange,
        handleRequestCountChange,
        updateDriverPaymentRequestsCount,
        handleOrderFromFileCreated,
        updateUnreadNotificationsCount,
        getChatInfoAction,
        updateIssuesCount,
    };
};
