import React, { useMemo } from 'react';

import { useChatsPermission } from '@hooks';
import { BalanceResource } from '@store/admin';
import { Avatar as AvatarType, DriverParent } from '@store/common';
import { classname, getBalanceInfo, translateByNamespace } from '@utils';

import { Avatar } from '../avatar';
import { OpenSupportChatButton } from '../chats';
import { DriverParentInfo } from '../driver-parent-info';
import { HelperText } from '../table';

import './user-info-block.scss';

type UserInfoBlockProps = {
    avatar: AvatarType | null;
    name: string;
    nickname?: string;
    role?: string;
    roleName?: string;
    parent?: DriverParent | null;
    trimName?: boolean;
    balance?: BalanceResource | null;
    accountPublicId?: string | null;
    showBalance?: boolean;
    showChatButton?: boolean;
    hideAvatar?: boolean;
    onNameClick?: () => void;
};

type UserNameProps = Pick<UserInfoBlockProps, 'name' | 'nickname' | 'trimName' | 'showChatButton' | 'onNameClick'>;

const cn = classname('user-info-block');
const t = translateByNamespace('common:user-info-block');

export const UserName = ({ name, nickname, trimName, showChatButton = false, onNameClick }: UserNameProps) => (
    <h4 className={cn('name', { 'has-button': showChatButton, trimmed: trimName, disabled: !onNameClick })} onClick={onNameClick}>
        {name} {nickname && `(${nickname})`}
    </h4>
);

export const UserInfoBlock = ({
    avatar,
    name,
    nickname,
    role,
    roleName,
    trimName,
    balance,
    parent,
    showBalance = false,
    showChatButton = false,
    hideAvatar = false,
    accountPublicId,
    onNameClick,
}: UserInfoBlockProps) => {
    const hasChatsPermission = useChatsPermission();

    const balanceInfo = useMemo(() => {
        if (!showBalance) {
            return null;
        }

        if (balance) {
            if (parent) {
                return <DriverParentInfo parent={parent} disabled={true} isFulled={false} size='small' />;
            }

            const { isSuccess, isDanger, isAwaiting } = getBalanceInfo(balance.displayedBalance.amount) || {};

            return (
                <span className={cn('balance', { success: isSuccess, awaiting: isAwaiting, danger: isDanger })}>
                    {t('balance-label', { balance: balance.displayedBalance.formatted })}
                </span>
            );
        }

        return <span className={cn('balance', { danger: true })}>{t('no-user-balance')}</span>;
    }, [showBalance, balance, parent]);

    const roleText = (role || roleName)?.trim();

    return (
        <div className={cn()}>
            {!hideAvatar && <Avatar src={avatar?.url} />}
            <div>
                {showChatButton ? (
                    <div className={cn('name-and-button', { trimmed: trimName })}>
                        <UserName name={name} nickname={nickname} showChatButton={true} onNameClick={onNameClick} />
                        {hasChatsPermission && <OpenSupportChatButton name={name} accountId={accountPublicId} />}
                    </div>
                ) : (
                    <UserName name={name} nickname={nickname} showChatButton={false} trimName={trimName} onNameClick={onNameClick} />
                )}
                {roleText && <HelperText text={roleText} />}
                {balanceInfo}
            </div>
        </div>
    );
};
