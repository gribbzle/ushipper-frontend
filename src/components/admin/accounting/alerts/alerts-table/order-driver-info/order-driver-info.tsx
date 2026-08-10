import React from 'react';

import { UserInfoBlock } from '@/components/common/user-info-block/user-info-block';
import { useDriversViewPermission } from '@/hooks/accounting/use-drivers-view-permission';
import { useHandleOpenAccountingDrawerClick } from '@/hooks/accounting/use-handle-open-accounting-drawer-click';
import { User } from '@store/client';

export const OrderDriverInfo = ({ driver, showChatButton }: { driver?: User | null; showChatButton?: boolean }) => {
    const onClickHandler = useHandleOpenAccountingDrawerClick();

    const hasDriversViewPermission = useDriversViewPermission();

    if (!driver) {
        return <>—</>;
    }

    const { avatar, name, nickname, defaultBalance, parent, accountPublicId } = driver;

    return (
        <UserInfoBlock
            avatar={avatar}
            name={name}
            nickname={nickname}
            balance={defaultBalance}
            showBalance={true}
            parent={parent}
            accountPublicId={accountPublicId}
            showChatButton={showChatButton}
            onNameClick={hasDriversViewPermission ? () => onClickHandler(accountPublicId) : undefined}
            trimName={true}
        />
    );
};
