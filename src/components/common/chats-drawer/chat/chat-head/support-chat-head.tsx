import React, { useMemo } from 'react';

import { VerifiedIcon } from '@/components/common/verified-icon';
import { useMeAdmin } from '@hooks';
import { useAppSelector } from '@store';
import { ChatAccountInfo } from '@store/common/chats/types';
import { authorizedUserTwilioPhoneSelector } from '@store/global';
import { classname, formatInternationalPhoneNumber, translateByNamespace } from '@utils';

import { CallButtonBlock } from '../call-button-block';

import './chat-head.scss';

const t = translateByNamespace('common:chats');

const cn = classname('chat-head');

export const SupportChatHead = ({ driverAccount }: { driverAccount?: ChatAccountInfo | null }) => {
    const authorizedUserTwilioPhone = useAppSelector(authorizedUserTwilioPhoneSelector);

    const isMeAdmin = useMeAdmin();
    const { phone, phoneVerifiedAt, name } = driverAccount || {};
    const externalPhone = useMemo(() => (phone ? phone : null), [phone]);

    const title = useMemo(() => {
        if (isMeAdmin) {
            return (
                <div className={cn('support-title')}>
                    {name ?? t('driver-label')}
                    {phone && (
                        <span className={cn('support-driver-phone')}>
                            {formatInternationalPhoneNumber(phone)} <VerifiedIcon checked={!!phoneVerifiedAt} />
                        </span>
                    )}
                </div>
            );
        }

        return t('support-chat-header');
    }, [isMeAdmin, name, phone, phoneVerifiedAt]);

    const chatHead = useMemo(
        () => (
            <div className={cn('info', { mode: 'support' })}>
                <div className={cn('content')}>
                    <div className={cn('info-orders')}>
                        <h4>{title}</h4>
                    </div>
                    {isMeAdmin && externalPhone && !!phoneVerifiedAt && authorizedUserTwilioPhone && <CallButtonBlock phone={externalPhone} />}
                </div>
            </div>
        ),

        [authorizedUserTwilioPhone, externalPhone, phoneVerifiedAt, isMeAdmin, title],
    );

    return <>{chatHead}</>;
};
