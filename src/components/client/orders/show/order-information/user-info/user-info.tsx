import React, { useMemo } from 'react';
import { toKebabCase } from 'js-convert-case';

import { UserRoleType } from '@/enums';
import { Avatar, Badge, Button, DriverParentInfo } from '@components';
import { useIsAdminPage, useIsPartnerCompany, useMeDriverRelated } from '@hooks';
import { UserPlusIcon } from '@icons';
import { User } from '@store/common';
import { classname, formatToCurrency, getBalanceInfo, translateByNamespace } from '@utils';

import { OrderInfoDetailsWrapper } from '../order-info-details-wrapper';

import './user-info.scss';

const t = translateByNamespace('client:order:order-information');
const cn = classname('user-info');

type Props = {
    user: User | null | undefined;
    type: UserRoleType;
    onDrawerOpen?: () => void;
    showBalance?: boolean;
};

export const UserInfo = ({ user, type, onDrawerOpen, showBalance = false }: Props) => {
    const isAdminPage = useIsAdminPage();
    const isMePartner = useIsPartnerCompany();
    const isDriver = useMeDriverRelated();
    const roleTypeKey = toKebabCase(type);

    const { defaultBalance, parent } = user || {};

    const balanceInfo = useMemo(() => {
        if (parent) {
            const isFulled = isAdminPage || (isMePartner && !isDriver);

            return <DriverParentInfo parent={parent} isFulled={isFulled} />;
        }

        if (!defaultBalance) {
            return <div className={cn('description', { danger: true })}>{t('no-user-balance', { user: t(`short-${roleTypeKey}`) })}</div>;
        }

        const { balanceValue, isSuccess, isDanger, isAwaiting } = getBalanceInfo(defaultBalance.displayedBalance.amount);

        return (
            <div className={cn('description', { success: isSuccess, awaiting: isAwaiting, danger: isDanger })}>
                {t('balance-label', { balance: formatToCurrency(balanceValue) })}
            </div>
        );
    }, [parent, defaultBalance, isAdminPage, isDriver, isMePartner, roleTypeKey]);

    if (!user) {
        return (
            <OrderInfoDetailsWrapper title={t(`short-${roleTypeKey}`)}>
                <div className={cn('no-user')}>
                    <div className={cn('message')}>{t('not-assigned-label')}</div>
                    {onDrawerOpen && (
                        <Button view='primary' className={cn('assign-btn')} size='small' onClick={onDrawerOpen}>
                            <UserPlusIcon /> {t(`assign-${roleTypeKey}-btn-label`)}
                        </Button>
                    )}
                </div>
            </OrderInfoDetailsWrapper>
        );
    }

    return (
        <OrderInfoDetailsWrapper title={t(`short-${roleTypeKey}`)}>
            <div onClick={onDrawerOpen}>
                <Badge size='mini' color={showBalance && !defaultBalance ? 'danger' : undefined} withBorder={showBalance && !defaultBalance}>
                    <Avatar src={user.avatar?.url} />
                </Badge>
            </div>
            <div>
                <div className={cn('username', { danger: showBalance && !defaultBalance })}>
                    {user.name} {user.nickname && `(${user.nickname})`}
                </div>
                {showBalance ? balanceInfo : <div className={cn('description')}>{user.roleName}</div>}
            </div>
        </OrderInfoDetailsWrapper>
    );
};
