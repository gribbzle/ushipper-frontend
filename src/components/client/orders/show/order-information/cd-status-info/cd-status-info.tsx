import React, { useCallback } from 'react';
import { toast } from 'react-toastify';

import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/components/common';
import { useMeCarrier } from '@hooks';
import { useAppDispatch, useAppSelector } from '@store';
import { usePartiallyUpdateOrderMutation } from '@store/api/orders-api';
import { orderPublicIdSelector, ordersActions } from '@store/client';
import { classname, diffForHumans, translateByNamespace } from '@utils';

import { OrderInfoDetailsWrapper } from '../order-info-details-wrapper';

import './cd-status-info.scss';

const t = translateByNamespace('client:order:order-information');
const translateOrderItem = translateByNamespace('client:orders-page:order-item');
const tOrderNotification = translateByNamespace('client:order');

const cn = classname('cd-status-info');

export const CDStatusInfo = ({ changedAt }: { changedAt?: string }) => {
    const isMeCarrier = useMeCarrier();
    const dispatch = useAppDispatch();
    const [partiallyUpdateOrder] = usePartiallyUpdateOrderMutation();
    const publicOrderId = useAppSelector(orderPublicIdSelector);

    const handleAcceptedClick = useCallback(() => {
        if (publicOrderId) {
            partiallyUpdateOrder({ publicOrderId, newOrderData: { isExternalContractChangesAccepted: true } })
                .unwrap()
                .then(order => {
                    toast.success<string>(tOrderNotification('mark-as-delivered-order-success-notification'));

                    dispatch(ordersActions.setOrderData(order));
                })
                .catch(() => {
                    toast.error<string>(tOrderNotification('update-error-notification'));
                });
        }
    }, [dispatch, partiallyUpdateOrder, publicOrderId]);

    if (!(changedAt && isMeCarrier)) {
        return null;
    }

    return (
        <OrderInfoDetailsWrapper title={t('cd-status-title')}>
            <div className={cn()}>
                <div className={cn('tag')}>{translateOrderItem('changed-by-broker')}</div>
                <div className={cn('row')}>
                    {changedAt && <span className={cn('time')}> {diffForHumans(new Date(changedAt), true)}</span>}
                    <Tooltip>
                        <TooltipTrigger>
                            <Button view='link' className={cn('accepted')} onClick={handleAcceptedClick}>
                                {t('accepted-btn')}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t('mark-changes-as-accepted')}</TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </OrderInfoDetailsWrapper>
    );
};
