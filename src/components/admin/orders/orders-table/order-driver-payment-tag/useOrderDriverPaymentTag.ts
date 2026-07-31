import { useCallback, useMemo } from 'react';

import { DropdownDividerOption, DropdownOption } from '@/components/common';
import {
    useCodCopOrderOptions,
    useInstantPaymentAttachments,
    useOpenDriverPaymentFormDrawer,
    useOrder,
    useOrderHelpers,
    useOrdersActionsPermission,
} from '@/hooks/order';
import { getFormattedToCurrencyTotalPayment } from '@/utils/payment';
import { InstantTermPaymentType } from '@enums';
import { diffForHumans } from '@utils/dates';
import { translateByNamespace } from '@utils/i18n';
import { translateActionRequired, translateDriverPaymentTagLabel } from '@utils/translate/order/instant-term-payment-type-translations';

import { INSTANT_TERM_PAYMENT_TYPE_TAG_VARIANT } from './constants';

const tLabels = translateByNamespace('admin:orders-page:driver-payment-tag:labels');
const tOptions = translateByNamespace('admin:orders-page:driver-payment-tag:options');

export const useOrderDriverPaymentTag = () => {
    const {
        publicId,
        details,
        instantTermPaymentType,
        instantTermPaymentMethod,
        deletedAt,
        paymentInformation,
        driver,
        price,
        instantTermPaidAt,
        instantTermDeclinedAt,
        instantTermPaymentDeclineReason,
    } = useOrder();

    const { isDeliveredOrder, isOrderCheckCompanyPaid, isCheckDeclined, isCheckApproval, isOrderCheckDriver } = useOrderHelpers();
    const hasOrdersActionsPermission = useOrdersActionsPermission();

    const disabled = useMemo(
        (): boolean => !hasOrdersActionsPermission || !isDeliveredOrder || !!deletedAt,
        [hasOrdersActionsPermission, isDeliveredOrder, deletedAt],
    );

    const variant = useMemo(
        (): string => INSTANT_TERM_PAYMENT_TYPE_TAG_VARIANT[instantTermPaymentType ?? InstantTermPaymentType.RECIPIENT_DRIVER],
        [instantTermPaymentType],
    );

    const label = useMemo((): string => {
        if (!instantTermPaymentType) {
            return translateActionRequired();
        }

        if (isOrderCheckCompanyPaid) {
            return tLabels('receipt-paid', { amount: getFormattedToCurrencyTotalPayment(paymentInformation) });
        }

        return translateDriverPaymentTagLabel(instantTermPaymentType);
    }, [instantTermPaymentType, paymentInformation, isOrderCheckCompanyPaid]);

    const { latestPaymentDocument } = useInstantPaymentAttachments(publicId);
    const openDriverPaymentFormDrawer = useOpenDriverPaymentFormDrawer();

    const handleOpenDriverPaymentFormDrawerClick = useCallback(
        () =>
            openDriverPaymentFormDrawer({
                orderId: publicId,
                attachment: latestPaymentDocument,
                instantTermPaymentType,
                instantTermPaymentMethod,
            }),
        [openDriverPaymentFormDrawer, publicId, latestPaymentDocument, instantTermPaymentType, instantTermPaymentMethod],
    );

    const handleViewInCopCopClick = useCallback(() => {
        if (details.orderId) {
            const url = `/admin/accounting/cod-cop?searchSubject=order_id&search=${encodeURIComponent(details.orderId)}`;

            window.open(url, '_blank');
        }
    }, [details?.orderId]);

    const codCopOrderOptions = useCodCopOrderOptions({ publicId, driver, driverPay: price, instantTermPaymentType });

    const options = useMemo((): Array<DropdownOption | DropdownDividerOption> => {
        const showViewInCodCopOption = !!details.orderId && !!instantTermPaymentType;

        return [
            {
                label: tOptions('send-payment-form'),
                onClick: handleOpenDriverPaymentFormDrawerClick,
                show: !instantTermPaymentType,
            },
            {
                label: tOptions('edit-payment-form'),
                onClick: handleOpenDriverPaymentFormDrawerClick,
                show: isCheckApproval || isOrderCheckDriver,
            },
            {
                label: tOptions('resend-payment-form'),
                onClick: handleOpenDriverPaymentFormDrawerClick,
                show: isCheckDeclined,
            },
            ...codCopOrderOptions,
            {
                divider: true,
                show: showViewInCodCopOption,
            },
            {
                label: tOptions('view-in-cod-cop'),
                onClick: handleViewInCopCopClick,
                show: showViewInCodCopOption,
            },
        ];
    }, [
        handleOpenDriverPaymentFormDrawerClick,
        handleViewInCopCopClick,
        instantTermPaymentType,
        isCheckApproval,
        isOrderCheckDriver,
        isCheckDeclined,
        codCopOrderOptions,
        details.orderId,
    ]);

    const time = useMemo((): string | null => {
        if (isOrderCheckCompanyPaid && instantTermPaidAt) {
            return diffForHumans(new Date(instantTermPaidAt), true);
        }

        if (isCheckDeclined && instantTermDeclinedAt) {
            return diffForHumans(new Date(instantTermDeclinedAt), true);
        }

        return null;
    }, [instantTermDeclinedAt, instantTermPaidAt, isCheckDeclined, isOrderCheckCompanyPaid]);

    const tooltipContent = useMemo(() => (isCheckDeclined ? instantTermPaymentDeclineReason : null), [instantTermPaymentDeclineReason, isCheckDeclined]);

    return { variant, label, disabled, options, time, tooltipContent };
};
