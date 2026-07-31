import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { Load } from '@store/client';
import { loadboardActions } from '@store/client/loadboard/slice';
import { translateByNamespace } from '@utils/i18n';

import { useCreateEmptyRequest } from './use-create-empty-request';
import { useSendRequestConditions } from './use-send-request-conditions';

const t = translateByNamespace('client:loadboard:item');
const tNotice = translateByNamespace('client:loadboard:notice');

export const useSendRequestAction = (order: Load) => {
    const dispatch = useDispatch();

    const { createEmptyRequest } = useCreateEmptyRequest();

    const {
        isSingleDriverOrDispatcher,
        isEmptySendRequest,
        isDriverWithMultipleAccountsAndNoPartner,
        lacksSendRequestForCarrierDriverPermission,
        hasSendRequestForNoPartnerUserPermission,
        isMeDriver,
    } = useSendRequestConditions();

    const sendRequest = useCallback(async () => {
        if (isSingleDriverOrDispatcher) {
            dispatch(loadboardActions.setLoadboardNoticePopup({ opened: true, description: tNotice('description') }));

            return;
        }

        if (isEmptySendRequest) {
            createEmptyRequest(order.publicId);
        } else if ((isDriverWithMultipleAccountsAndNoPartner && !hasSendRequestForNoPartnerUserPermission) || lacksSendRequestForCarrierDriverPermission) {
            dispatch(loadboardActions.setLoadboardNoticePopup({ opened: true, description: tNotice('no-send-request-permission') }));
        } else {
            dispatch(
                loadboardActions.setRequestDrawer({
                    opened: true,
                    order: order,
                    title: t('send-request'),
                }),
            );
        }
    }, [
        isSingleDriverOrDispatcher,
        isEmptySendRequest,
        isDriverWithMultipleAccountsAndNoPartner,
        lacksSendRequestForCarrierDriverPermission,
        hasSendRequestForNoPartnerUserPermission,
        dispatch,
        createEmptyRequest,
        order,
    ]);

    return {
        sendRequest,
        isMeDriver,
    };
};
