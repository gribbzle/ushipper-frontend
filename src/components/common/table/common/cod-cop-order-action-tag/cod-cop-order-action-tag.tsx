import React from 'react';

import { FloatingDropdown } from '@/components/common/dropdown/floating-dropdown';
import { InstantTermPaymentType } from '@/enums';
import { useTransactionActionsPermission } from '@hooks';
import { StatusTag, StatusTagView } from '@/components/ui/data-display/status-tag';
import { classname } from '@utils/classname';
import { diffForHumans } from '@utils/dates';
import { translateByNamespace } from '@utils/i18n';
import { getOrderCheckStatuses } from '@utils/orders/order-payment-helpers';

import { CodCopOrdersActionTagProps } from './cod-cop-order-action-tag.types';
import { useCodCopOrdersActionTag } from './use-cod-cop-order-action-tag';

import './cod-cop-order-action-tag.scss';

const cn = classname('cod-cop-order-action-tag');
const t = translateByNamespace('admin:orders-page:cod-cop-order-action-tag');

const statusViewMap: Partial<Record<InstantTermPaymentType, StatusTagView>> = {
    [InstantTermPaymentType.RECIPIENT_COMPANY]: 'pending',
    [InstantTermPaymentType.RECIPIENT_COMPANY_DECLINED]: 'danger',
    [InstantTermPaymentType.RECIPIENT_COMPANY_PAID]: 'success',
};

export const CodCopOrdersActionTag = ({
    publicId,
    driver,
    driverPay,
    instantTermPaymentType,
    declinedAt,
    paidAt,
    instantTermPaymentDeclineReason,
    className,
    inline = false,
}: CodCopOrdersActionTagProps) => {
    const { label, options, hasOptions } = useCodCopOrdersActionTag({ publicId, driver, driverPay, instantTermPaymentType });
    const hasActionsPermission = useTransactionActionsPermission();

    const { isCheckDeclined, isOrderCheckCompanyPaid } = getOrderCheckStatuses(instantTermPaymentType);

    const disabled = !hasActionsPermission || !hasOptions;

    const statusView = statusViewMap[instantTermPaymentType] || 'new';

    return (
        <div className={cn('wrapper', { inline }, [className])}>
            <FloatingDropdown dataTestId='cod-cop-orders-actions' options={options} disabled={disabled}>
                <StatusTag label={label} view={statusView} disabled={disabled} />
            </FloatingDropdown>
            {isOrderCheckCompanyPaid && paidAt && <span className={cn('time')}> {diffForHumans(new Date(paidAt), true)}</span>}
            {isCheckDeclined && (
                <>
                    {declinedAt && <span className={cn('time')}> {diffForHumans(new Date(declinedAt), true)}</span>}{' '}
                    {instantTermPaymentDeclineReason && (
                        <span className={cn('reason')}>
                            {t('reason')}: {instantTermPaymentDeclineReason}
                        </span>
                    )}
                </>
            )}
        </div>
    );
};
