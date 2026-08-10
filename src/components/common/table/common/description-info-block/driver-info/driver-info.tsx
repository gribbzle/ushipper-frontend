import React from 'react';

import { OpenSupportChatButton } from '@/components/common/chats/open-support-chat-button/open-support-chat-button';
import { Link } from '@/components/common/link/link';
import { useChatsPermission } from '@/hooks/chat/use-chats-permission';
import { useMeAdmin } from '@/hooks/use-user-role-group';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('admin:accounting:balance-table');

type DriverInfoProps = {
    name: string;
    accountId?: string | null;
};

export const DriverInfo = ({ name, accountId }: DriverInfoProps) => {
    const isMeAdmin = useMeAdmin();
    const hasChatsPermission = useChatsPermission();

    return (
        <span>
            {t('driver-label')}:{' '}
            {isMeAdmin ? (
                <>
                    <Link href={{ pathname: '/admin/accounting/drivers', query: { name } }} target='blank'>
                        {name}
                    </Link>{' '}
                    {hasChatsPermission && <OpenSupportChatButton name={name} accountId={accountId} />}
                </>
            ) : (
                <strong>{name}</strong>
            )}
        </span>
    );
};
