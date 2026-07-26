import { useMemo } from 'react';

import { FundsTransferStatus } from '@/enums';
import { useOrder, useUpdateFundsTransferStatus } from '@/hooks/order';
import { useOpenMarkAsDocumentsRequestedPopup } from '@components';
import { translateFundsTransferStatusAction } from '@utils';

const DOCUMENTS_OPTIONS = [FundsTransferStatus.DOCUMENTS_REQUESTED, FundsTransferStatus.DOCUMENTS_SUBMITTED];

const COMMON_TRANSITIONS = [
    FundsTransferStatus.NONE,
    FundsTransferStatus.FACTORING_REQUESTED,
    ...DOCUMENTS_OPTIONS,
    FundsTransferStatus.FACTORING_CONFIRMED,
    FundsTransferStatus.INITIATED,
    FundsTransferStatus.DAMAGE_CLAIM,
];

const statusTransitions: Record<FundsTransferStatus, FundsTransferStatus[]> = {
    [FundsTransferStatus.NONE]: [...COMMON_TRANSITIONS],
    [FundsTransferStatus.FACTORING_REQUESTED]: [...COMMON_TRANSITIONS],
    [FundsTransferStatus.DOCUMENTS_REQUESTED]: [...COMMON_TRANSITIONS],
    [FundsTransferStatus.DOCUMENTS_SUBMITTED]: [...COMMON_TRANSITIONS],
    [FundsTransferStatus.FACTORING_CONFIRMED]: [...COMMON_TRANSITIONS],
    [FundsTransferStatus.DAMAGE_CLAIM]: [...COMMON_TRANSITIONS],
    [FundsTransferStatus.INITIATED]: [FundsTransferStatus.NONE, ...DOCUMENTS_OPTIONS, FundsTransferStatus.DAMAGE_CLAIM],
    [FundsTransferStatus.COMPLETED]: [FundsTransferStatus.NONE, ...DOCUMENTS_OPTIONS, FundsTransferStatus.DAMAGE_CLAIM],
};

export const useFundsTransferStatusOptions = () => {
    const { publicId, fundsTransferStatus, details } = useOrder();

    const handleChangeFundsTransferStatus = useUpdateFundsTransferStatus(publicId);
    const handleMarkAsDocumentsRequested = useOpenMarkAsDocumentsRequestedPopup();

    const availableTransitions = useMemo(() => (fundsTransferStatus ? statusTransitions[fundsTransferStatus] : []), [fundsTransferStatus]);

    return useMemo(
        () =>
            availableTransitions.map(val => {
                if (val === FundsTransferStatus.DOCUMENTS_REQUESTED) {
                    return {
                        label: translateFundsTransferStatusAction(val),
                        onClick: () =>
                            handleMarkAsDocumentsRequested({
                                orderPublicId: publicId,
                                orderId: details.orderId,
                            }),
                        show: fundsTransferStatus !== val,
                    };
                }

                return {
                    label: translateFundsTransferStatusAction(val),
                    onClick: () => handleChangeFundsTransferStatus(val),
                    show: fundsTransferStatus !== val,
                };
            }),
        [availableTransitions, details.orderId, fundsTransferStatus, handleChangeFundsTransferStatus, handleMarkAsDocumentsRequested, publicId],
    );
};
