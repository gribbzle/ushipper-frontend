import React from 'react';

import { FloatingDropdown } from '@/components/common';
import { InstantTermPaymentType } from '@/enums';
import { useTransactionActionsPermission } from '@hooks';
import { User } from '@store/client';
import { StatusTag, StatusTagView } from '@ui';
import { classname, diffForHumans, getOrderCheckStatuses, translateByNamespace } from '@utils';

import { useCodCopOrdersActionTag } from './use-cod-cop-order-action-tag';

import './cod-cop-order-action-tag.scss';

const cn = classname('cod-cop-order-action-tag');
const t = translateByNamespace('admin:orders-page:cod-cop-order-action-tag');

export type CodCopOrdersActionTagProps = {
    publicId: string;
    driver: User | null;
    driverPay?: number | null;
    instantTermPaymentType: InstantTermPaymentType;
    declinedAt?: string | null;
    paidAt?: string | null;
    instantTermPaymentDeclineReason?: string | null;
    className?: string;
    inline?: boolean;
};

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
