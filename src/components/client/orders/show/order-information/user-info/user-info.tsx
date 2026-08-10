import React, { useMemo } from 'react';
import { toKebabCase } from 'js-convert-case';

import { Avatar } from '@/components/common/avatar/avatar';
import { Badge } from '@/components/common/badge/badge';
import { Button } from '@/components/common/button/button';
import { DriverParentInfo } from '@/components/common/driver-parent-info/driver-parent-info';
import { UserRoleType } from '@/enums/user-role-type';
import { useIsAdminPage } from '@/hooks/use-is-admin-page';
import { useIsPartnerCompany } from '@/hooks/authorized-user/use-is-partner-company';
import { useMeDriverRelated } from '@/hooks/use-user-role-group';
import { User } from '@store/common';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { formatToCurrency } from '@utils/numbers';
import { getBalanceInfo } from '@utils/orders/get-balance-info';

import { OrderInfoDetailsWrapper } from '../order-info-details-wrapper';

import './user-info.scss';
import UserPlusIcon from '@/assets/icons/user-plus.svg';

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
