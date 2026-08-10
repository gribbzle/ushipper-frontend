import React from 'react';

import { Avatar } from '@/components/common/avatar/avatar';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { Button } from '../../button';
import { Dropdown } from '../../dropdown';

import { NotificationProps } from './notification.types';
import { useNotification } from './use-notification';

import './notification.scss';
import ActionsIcon from '@/assets/icons/actions-icon.svg';
import SystemIcon from '@/assets/icons/system-icon.svg';

const t = translateByNamespace('common:notifications');
const activityT = translateByNamespace('client:order:activity');
const cn = classname('notification');

export const Notification = (props: NotificationProps) => {
    const { creator, type, readAt, pinnedAt } = props;

    const {
        isCarrier,
        itemRef,
        isDeleted,
        content,
        createdAtTime,
        showOpenLoadboardOrderButton,
        openViewJobOfferDrawerHandler,
        openOfferDrawerHandler,
        onOpenLoadboardOrderHandler,
        onOpenOrderHandler,
        onDeleteHandler,
        markAsReadSilently,
        onReadHandler,
        onPinHanlder,
    } = useNotification(props);

    return (
        <div onClick={markAsReadSilently} className={cn('', { read: !readAt, deleted: isDeleted })} ref={itemRef}>
            <div className={cn('user')}>
                {creator ? <Avatar src={creator?.avatar?.url} /> : <SystemIcon className={cn('system-icon')} />}
                <div>
                    <h4>{creator ? creator?.name : activityT('system-name')}</h4>
                    <p>{createdAtTime}</p>
                </div>
            </div>
            <div className={cn('content')}>{content}</div>
            {type !== 'driver_low_balance' && (
                <>
                    {showOpenLoadboardOrderButton ? (
                        <Button view='primary' size='small' className={cn('open-load-button')} onClick={onOpenLoadboardOrderHandler}>
                            {t('open-order-button')}
                        </Button>
                    ) : type === 'order_offer_created' && isCarrier ? (
                        <Button view='primary' size='small' className={cn('open-load-button')} onClick={openOfferDrawerHandler}>
                            {t('open-offer-button')}
                        </Button>
                    ) : type === 'job_offer_created' ? (
                        <Button view='primary' size='small' className={cn('open-load-button')} onClick={openViewJobOfferDrawerHandler}>
                            {t('view-offer-button')}
                        </Button>
                    ) : (
                        <Button view='primary' size='small' className={cn('open-load-button')} onClick={onOpenOrderHandler}>
                            {t('open-order-button')}
                        </Button>
                    )}
                </>
            )}

            <Dropdown
                options={[
                    {
                        label: t(pinnedAt ? 'unpin-button' : 'pin-button'),
                        onClick: onPinHanlder,
                    },
                    {
                        label: t(readAt ? 'mark-as-unread-button' : 'mark-as-read-button'),
                        onClick: onReadHandler,
                    },
                    {
                        label: t('delete-button'),
                        onClick: onDeleteHandler,
                    },
                ]}
            >
                <ActionsIcon />
            </Dropdown>
        </div>
    );
};
