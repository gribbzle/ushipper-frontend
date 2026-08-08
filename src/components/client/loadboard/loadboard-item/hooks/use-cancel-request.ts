import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { RequestStatusesEnum } from '@/enums/request-statuses';
import loadboardApi from '@store/api/loadboard-api';
import { usePartiallyUpdateRequestMutation } from '@store/api/order-requests-api';
import { translateByNamespace } from '@utils/i18n';

const translateRequest = translateByNamespace('client:loadboard:request-form');

export const useCancelRequest = ({ publicOrderId, publicRequestId }: { publicOrderId: string; publicRequestId?: string }) => {
    const dispatch = useDispatch();

    const [updateRequest] = usePartiallyUpdateRequestMutation();

    const handleCancelRequest = useCallback(() => {
        if (publicRequestId) {
            updateRequest({
                publicOrderId,
                publicRequestId,
                data: { status: RequestStatusesEnum.CANCELED },
            }).then(() => {
                toast.success<string>(translateRequest('request-canceled-success-notification'));
                dispatch(
                    loadboardApi.util.invalidateTags([
                        { type: 'Loadboard', id: 'LIST' },
                        { type: 'Loadboard', id: 'Statistic' },
                    ]),
                );
            });
        }
    }, [publicOrderId, publicRequestId, dispatch, updateRequest]);

    return { handleCancelRequest };
};
