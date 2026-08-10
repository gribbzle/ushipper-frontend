import { useCallback, useMemo } from 'react';

import { DropdownOption } from '@/components/common/dropdown/dropdown';
import { InstantTermPaymentType } from '@/enums/instant-term-payment-type';
import { useAppDispatch } from '@store';
import { accountingActions } from '@store/admin';
import { Load } from '@store/client';
import { translateByNamespace } from '@utils/i18n';
import { formatToCurrency } from '@utils/numbers';
import { getOrderCheckStatuses } from '@utils/orders/order-payment-helpers';

export type UseCodCopOrderOptionsProps = Pick<Load, 'publicId' | 'driver' | 'instantTermPaymentType'> & {
    driverPay?: number | null;
};

const t = translateByNamespace('common:orders:order-cod-cop-options');

export const useCodCopOrderOptions = ({ publicId, driver, driverPay, instantTermPaymentType }: UseCodCopOrderOptionsProps) => {
    const dispatch = useAppDispatch();

    const openDeclinedOrPayToDriverPopupHandler = useCallback(
        (instantTermPaymentType: InstantTermPaymentType.RECIPIENT_COMPANY_DECLINED | InstantTermPaymentType.RECIPIENT_COMPANY_PAID) => {
            dispatch(
                accountingActions.setDeclineOrPayToDriverPopupProps({
                    isPopupOpened: true,
                    orderPublicId: publicId,
                    driverName: driver?.name ?? '',
                    driverPay: driverPay ? formatToCurrency(driverPay / 100) : '',
                    instantTermPaymentType,
                }),
            );
        },
        [dispatch, driver?.name, driverPay, publicId],
    );

    return useMemo<DropdownOption[]>(() => {
        const { isCheckDeclined, isOrderCheckCompanyPaid, isCheckApproval } = getOrderCheckStatuses(instantTermPaymentType);

        return [
            {
                label: t('pay'),
                onClick: () => openDeclinedOrPayToDriverPopupHandler(InstantTermPaymentType.RECIPIENT_COMPANY_PAID),
                show: isCheckApproval || isCheckDeclined,
            },
            {
                label: t('decline'),
                onClick: () => openDeclinedOrPayToDriverPopupHandler(InstantTermPaymentType.RECIPIENT_COMPANY_DECLINED),
                show: isCheckApproval || isOrderCheckCompanyPaid,
            },
        ];
    }, [openDeclinedOrPayToDriverPopupHandler, instantTermPaymentType]);
};
