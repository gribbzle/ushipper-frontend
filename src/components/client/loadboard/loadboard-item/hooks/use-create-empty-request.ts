import { useCallback } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import loadboardApi from '@store/api/loadboard-api';
import { useCreateRequestMutation } from '@store/api/order-requests-api';
import { loadboardActions } from '@store/client/loadboard';
import { translateByNamespace } from '@utils/i18n';
import { getTranslateParsedOrderNotification } from '@utils/translate/get-translate-parsed-order-notification';

const tNotification = translateByNamespace('client:loadboard:notifications');

export const useCreateEmptyRequest = () => {
    const dispatch = useDispatch();
    const [createRequest] = useCreateRequestMutation();

    const createEmptyRequest = useCallback(
        (orderId: string) => {
            createRequest({
                orderId,
                data: {},
            })
                .unwrap()
                .then(() => {
                    toast.success<string>(tNotification('request-from-driver-to-dispatcher-success-notification'));
                    dispatch(
                        loadboardApi.util.invalidateTags([
                            { type: 'Loadboard', id: 'LIST' },
                            { type: 'Loadboard', id: 'Statistic' },
                        ]),
                    );
                })
                .catch(exception => {
                    const { data, status } = exception as AxiosResponse<AxiosError>;
                    const defaultError = tNotification('request-from-driver-to-dispatcher-error-notification');

                    if (status === 422) {
                        dispatch(loadboardActions.setLoadboardNoticePopup({ opened: true, description: data.message }));
                    } else if (status === 403) {
                        const message = getTranslateParsedOrderNotification({ error: data.message, defaultMessage: defaultError });

                        toast.error<string>(message);
                    } else {
                        toast.error<string>(defaultError);
                    }
                });
        },
        [dispatch, createRequest],
    );

    return { createEmptyRequest };
};
