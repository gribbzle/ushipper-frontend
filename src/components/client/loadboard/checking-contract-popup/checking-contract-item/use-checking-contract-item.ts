import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { CustomCheckContractError } from '@/components/common/parsed-order-actions/use-handle-check-contract';
import { useDownloadExternalContract } from '@/hooks/useDownload';
import { useAppDispatch, useAppSelector } from '@store';
import { useCreateAcceptExternalContractMutation, useCreateImportExternalContractMutation } from '@store/api/external-orders-api';
import { LoadBoardFilters } from '@store/api/loadboard-api';
import { checkingContractPopupSelector, loadboardActions } from '@store/client/loadboard';
import { translateByNamespace } from '@utils/i18n';

import { useCheckingContractPopup } from '../use-checking-contract-popup';
import { handleParsedOrderError } from '../utils';

const tNotification = translateByNamespace('client:loadboard:notifications');

export const useCheckingContractItem = (loadBoardFilters: LoadBoardFilters) => {
    const { publicOrderId, assignedDriverId, parsedOrders } = useAppSelector(checkingContractPopupSelector);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingDocument, setIsLoadingDocument] = useState<boolean>(false);

    const { handleClosePopup } = useCheckingContractPopup(loadBoardFilters);
    const downloadExternalContract = useDownloadExternalContract();

    const [acceptExternalContract] = useCreateAcceptExternalContractMutation();
    const [importExternalContract] = useCreateImportExternalContractMutation();

    const router = useRouter();
    const { push } = router;
    const dispatch = useAppDispatch();

    const handleSignContract = useCallback(
        async (externalOrderId: string) => {
            if (publicOrderId) {
                try {
                    setIsLoading(true);
                    const res = await acceptExternalContract({
                        publicOrderId,
                        externalOrderId,
                        ...(assignedDriverId && { assignedDriverId }),
                    }).unwrap();

                    const updatedParsedOrders = parsedOrders?.map(order => (order.id === externalOrderId ? { ...order, ...res } : order));

                    dispatch(loadboardActions.setCheckingContractPopup({ parsedOrders: updatedParsedOrders }));

                    toast.success<string>(tNotification('sign-contract-success-notification'));
                } catch (err) {
                    handleParsedOrderError(err as CustomCheckContractError, tNotification('sign-contract-error-notification'));
                }
                setIsLoading(false);
            }
        },
        [publicOrderId, parsedOrders, dispatch, acceptExternalContract, assignedDriverId],
    );

    const handleImportToUshipper = useCallback(
        async (contractSignedOrderPublicId?: string) => {
            if (contractSignedOrderPublicId) {
                try {
                    setIsLoading(true);

                    const res = await importExternalContract({
                        publicOrderId: contractSignedOrderPublicId,
                        ...(assignedDriverId && { assignedDriverId }),
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

                    toast.success<string>(tNotification('import-to-ushipper-success-notification'));

                    handleClosePopup();
                } catch (err) {
                    handleParsedOrderError(err as CustomCheckContractError, tNotification('import-to-ushipper-error-notification'));
                }
                setIsLoading(false);
            }
        },
        [importExternalContract, assignedDriverId, handleClosePopup, push],
    );

    const handleCancelContract = useCallback(
        async () => {
            if (publicOrderId) {
                try {
                    // TODO update api after the backend is ready
                    console.log('Cancel Contract');
                    toast.success<string>(tNotification('cancel-contract-success-notification'));
                } catch (err) {
                    handleParsedOrderError(err as CustomCheckContractError, tNotification('cancel-contract-error-notification'));
                }
            }
        },
        [publicOrderId],
    );

    const handleDownloadContract = useCallback(
        async (externalOrderId: string) => {
            if (publicOrderId) {
                setIsLoadingDocument(true);
                await downloadExternalContract({ publicOrderId, externalOrderId });
                setIsLoadingDocument(false);
            }
        },
        [downloadExternalContract, publicOrderId],
    );

    return { handleSignContract, handleDownloadContract, handleImportToUshipper, handleCancelContract, isLoading, isLoadingDocument };
};
