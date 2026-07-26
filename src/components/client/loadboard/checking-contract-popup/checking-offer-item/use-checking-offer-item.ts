import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { CustomCheckContractError } from '@/components/common/parsed-order-actions/use-handle-check-contract';
import { useAppSelector } from '@store';
import { ExternalOfferValues, useCreateAcceptExternalOfferMutation } from '@store/api/external-orders-api';
import { LoadBoardFilters } from '@store/api/loadboard-api';
import { checkingContractPopupSelector } from '@store/client/loadboard';
import { getObjectWithoutEmptyFields, translateByNamespace } from '@utils';

import { useCheckingContractPopup } from '../use-checking-contract-popup';
import { handleParsedOrderError } from '../utils';

const tNotification = translateByNamespace('client:loadboard:notifications');

export const useCheckingOfferItem = (loadBoardFilters: LoadBoardFilters) => {
    const { publicOrderId, assignedDriverId, externalAssignedDriverId, note } = useAppSelector(checkingContractPopupSelector);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { handleClosePopup } = useCheckingContractPopup(loadBoardFilters);
    const [acceptExternalOffer] = useCreateAcceptExternalOfferMutation();
    const router = useRouter();
    const { push } = router;

    const handleChooseAndSignOffer = useCallback(
        async (externalOfferId: string) => {
            if (publicOrderId) {
                try {
                    const data: Partial<ExternalOfferValues> = getObjectWithoutEmptyFields({ assignedDriverId, note, externalAssignedDriverId });

                    setIsLoading(true);

                    const res = await acceptExternalOffer({
                        publicOrderId,
                        externalOfferId,
                        data,
                    }).unwrap();

                    const createdOrderPublicId = res.publicId ?? null;

                    if (createdOrderPublicId) {
                        const ordersPath = '/client/orders';
                        const asOrdersPath = '/orders';

                        await push(
                            {
                                pathname: `${ordersPath}/[order-id]`,
                                query: {
                                    ['order-id']: createdOrderPublicId,
                                },
                            },
                            `${asOrdersPath}/${createdOrderPublicId}`,
                        );
                    }

                    toast.success<string>(tNotification('sign-offer-success-notification'));
                    handleClosePopup();
                } catch (err) {
                    handleParsedOrderError(err as CustomCheckContractError, tNotification('sign-offer-error-notification'));
                }
                setIsLoading(false);
            }
        },
        [publicOrderId, assignedDriverId, note, externalAssignedDriverId, push, acceptExternalOffer, handleClosePopup],
    );

    return { handleChooseAndSignOffer, isLoading };
};
