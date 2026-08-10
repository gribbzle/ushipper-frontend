import React, { useCallback, useMemo, useRef } from 'react';
import JsCookie from 'js-cookie';
import { useSelector } from 'react-redux';

import { Avatar } from '@/components/common/avatar/avatar';
import { UserRoleType } from '@/enums/user-role-type';
import { useAppDispatch } from '@store';
import { backToAdminSubmit } from '@store/client';
import { notificationsActions } from '@store/common';
import { authorizedUserSelector, revokeTokenAction } from '@store/global';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { Dropdown } from '../../dropdown';

import DropdownArrow from './dropdown-arrow.svg';
import NotificationsIcon from './notifications.svg';

import './header-user-block.scss';

const cn = classname('header-user-block');

const renderCounter = (count: number) => {
    if (!count) {
        return null;
    }

    const preparedCount = count > 100 ? '99+' : count;

    return (
        <>
            <span>{preparedCount}</span>
            <span>{preparedCount}</span>
        </>
    );
};

export const HeaderUserBlock = () => {
    const dispatch = useAppDispatch();
    const authorizedUser = useSelector(authorizedUserSelector);
    const ref = useRef<HTMLInputElement>(null);
    const prevTokenId = JsCookie.get('PrevTokenId');

    const logoutClickHandler = useCallback(() => {
        dispatch(revokeTokenAction());
    }, [dispatch]);

    const backToAdminClickHandler = useCallback(() => {
        dispatch(backToAdminSubmit());
    }, [dispatch]);

    const onNotificationsClickHandler = useCallback(() => {
        dispatch(notificationsActions.setIsDrawerOpen(true));
    }, [dispatch]);

    const tCompanyTypes = translateByNamespace('common:company-types');
    const tOptionLabel = translateByNamespace('common:main-layout-header');

    const roleDescription = useMemo(() => {
        if (authorizedUser?.roleType === UserRoleType.DISPATCHER_OWNER) {
            return tCompanyTypes('dispatcher');
        } else if (authorizedUser?.roleType === UserRoleType.DRIVER_OWNER) {
            return tCompanyTypes('driver');
        } else {
            return authorizedUser?.companyName;
        }
    }, [authorizedUser?.roleType, tCompanyTypes, authorizedUser?.companyName]);

    if (!authorizedUser) {
        return null;
    }

    const { name, nickname, avatar, countOfUnreadNotifications } = authorizedUser;

    return (
        <div className={cn('', 'no-print')} ref={ref}>
            <button className={cn('notifications-button')} onClick={onNotificationsClickHandler}>
                <NotificationsIcon onClick={onNotificationsClickHandler} />
                {renderCounter(countOfUnreadNotifications)}
            </button>
            <div className={cn('user-info')}>
                <Avatar src={avatar?.url} size='mini' />
                <Dropdown
                    options={[
                        ...(prevTokenId ? [{ label: tOptionLabel('back-to-admin'), onClick: backToAdminClickHandler }] : []),
                        { label: tOptionLabel('logout'), onClick: logoutClickHandler },
                    ]}
                >
                    <div className={cn('wrapper')}>
                        <div className={cn('user-details')}>
                            <span className={cn('user-details-name')}>
                                {name}
                                {nickname && ` (${nickname})`}
                            </span>
                            <span className={cn('user-details-company')}>{roleDescription}</span>
                        </div>
                        <DropdownArrow />
                    </div>
                </Dropdown>
            </div>
        </div>
    );
};
