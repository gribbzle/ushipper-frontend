import React from 'react';

import { Link, OpenSupportChatButton } from '@components';
import { useChatsPermission, useMeAdmin } from '@hooks';
import { translateByNamespace } from '@utils';

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
