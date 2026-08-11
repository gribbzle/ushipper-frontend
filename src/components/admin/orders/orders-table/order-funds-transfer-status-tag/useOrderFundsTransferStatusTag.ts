import { useCallback, useMemo } from 'react';

import { DropdownDividerOption, DropdownOption } from '@/components/common/dropdown/dropdown';
import { useFundsTransferStatusOptions } from '@/hooks/order/useFundsTransferStatusOptions';
import { useOrder } from '@/hooks/order/useOrder';
import { useOrderHelpers } from '@/hooks/order/useOrderHelpers';
import { useOrderPaymentInformationHelpers } from '@/hooks/order/useOrderPaymentInformationHelpers';
import { useOrdersActionsPermission } from '@/hooks/order/use-orders-actions-permission';
import { FundsTransferStatusView } from '@/enums/funds-transfer-status';
import { useOpenTransactionsPage } from '@/hooks/navigation/useOpenTransactionsPage';
import { diffForHumans } from '@utils/dates';
import { translateByNamespace } from '@utils/i18n';
import { getAwaitingDeliveryLabel, translateFundsTransferStatus } from '@utils/translate/order/funds-transfer-status-translations';

import { FUNDS_TRANSFER_STATUS_VIEW } from './constants';

const t = translateByNamespace('admin:orders-page:funds-transfer-status-tag');

export const useOrderFundsTransferStatusTag = () => {
    const hasOrdersActionsPermission = useOrdersActionsPermission();
    const { fundsTransferStatus, fundsTransferredAt, fundsTransferUpdatedAt, details, deletedAt, driverFeeCharge } = useOrder();
    const { isDeliveredOrder, isOrderFundsTransferStatusCompleted, isOrderFundsTransferStatusInitiated, isAwaitingDeliveryOrder } = useOrderHelpers();
    const { driverPay, isOnlyInstantTermsOrder } = useOrderPaymentInformationHelpers();

    const disabled = useMemo(
        (): boolean => !hasOrdersActionsPermission || !isDeliveredOrder || !!deletedAt || (isOnlyInstantTermsOrder && !isOrderFundsTransferStatusCompleted),
        [deletedAt, hasOrdersActionsPermission, isDeliveredOrder, isOnlyInstantTermsOrder, isOrderFundsTransferStatusCompleted],
    );

    const view = useMemo((): FundsTransferStatusView => {
        if (isAwaitingDeliveryOrder || !fundsTransferStatus) {
            return FundsTransferStatusView.DEFAULT;
        }

        return FUNDS_TRANSFER_STATUS_VIEW[fundsTransferStatus];
    }, [fundsTransferStatus, isAwaitingDeliveryOrder]);

    const fundsTransferStatusOptions = useFundsTransferStatusOptions();
    const openTransactionsPage = useOpenTransactionsPage();

    const handleViewTransactionClick = useCallback(() => {
        if (details.orderId) {
            openTransactionsPage({ orderId: details.orderId });
        }
    }, [details?.orderId, openTransactionsPage]);

    const hideFundsTransferStatusOptions = useMemo(
        (): boolean => isOnlyInstantTermsOrder && isOrderFundsTransferStatusCompleted,
        [isOnlyInstantTermsOrder, isOrderFundsTransferStatusCompleted],
    );

    const showViewTransactionOption = useMemo(
        (): boolean => !!details.orderId && isOrderFundsTransferStatusCompleted,
        [details.orderId, isOrderFundsTransferStatusCompleted],
    );

    const options = useMemo(
        (): Array<DropdownOption | DropdownDividerOption> => [
            ...(hideFundsTransferStatusOptions ? [] : fundsTransferStatusOptions),
            {
                divider: true,
                show: showViewTransactionOption && !hideFundsTransferStatusOptions,
            },
            {
                label: t('view-transactions'),
                onClick: handleViewTransactionClick,
                show: showViewTransactionOption,
            },
        ],
        [hideFundsTransferStatusOptions, fundsTransferStatusOptions, showViewTransactionOption, handleViewTransactionClick],
    );

    const label = useMemo((): string | null => {
        if (isAwaitingDeliveryOrder || !fundsTransferStatus) {
            return getAwaitingDeliveryLabel();
        }

        if (isOrderFundsTransferStatusCompleted || isOrderFundsTransferStatusInitiated) {
            if (isOnlyInstantTermsOrder) {
                return t('driver-fee-charged', { amount: driverFeeCharge?.formatted ?? '' });
            }

            return t('paid', { amount: driverPay ?? '' });
        }

        return translateFundsTransferStatus(fundsTransferStatus);
    }, [
        isAwaitingDeliveryOrder,
        isOrderFundsTransferStatusCompleted,
        isOrderFundsTransferStatusInitiated,
        fundsTransferStatus,
        isOnlyInstantTermsOrder,
        driverPay,
        driverFeeCharge?.formatted,
    ]);

    const helperText = useMemo((): string | undefined => {
        const date = fundsTransferredAt && isDeliveredOrder ? fundsTransferredAt : fundsTransferUpdatedAt;

        return date ? diffForHumans(new Date(date), true) : undefined;
    }, [fundsTransferredAt, fundsTransferUpdatedAt, isDeliveredOrder]);

    return { view, label, disabled, options, isDeliveredOrder, helperText };
};
