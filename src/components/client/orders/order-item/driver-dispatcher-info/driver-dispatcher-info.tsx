import React from 'react';

import { UserRoleGroup, UserRoleType } from '@/enums';
import { useHasPartnerCompanies, useMeDriverRelated, useUserRoleGroup } from '@hooks';
import { User } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { UserInfo } from '../../show/order-information/user-info';

import './driver-dispatcher-info.scss';

const t = translateByNamespace('client:orders-page:order-item');
const cn = classname('driver-dispatcher-info');

type DriverDispatcherInfoProps = {
    dispatcher: User | null;
    driver: User | null;
};

export const DriverDispatcherInfo = ({ dispatcher, driver }: DriverDispatcherInfoProps) => {
    const userRoleGroup = useUserRoleGroup();
    const isDriver = useMeDriverRelated();
    const { hasPartnerCompanies } = useHasPartnerCompanies();

    return (
        <>
            {!hasPartnerCompanies && (
                <>
                    {dispatcher && (
                        <p>
                            {t('dispatcher-text')}{' '}
                            <b>
                                {dispatcher.name}
                                {dispatcher.nickname && ` (${dispatcher.nickname})`}
                            </b>
                        </p>
                    )}
                    {driver && (
                        <p>
                            {t('driver-text')}{' '}
                            <b>
                                {driver.name}
                                {driver.nickname && ` (${driver.nickname})`}
                            </b>
                        </p>
                    )}
                </>
            )}
            {hasPartnerCompanies && (
                <div className={cn()}>
                    <UserInfo user={driver} type={UserRoleType.CARRIER_DRIVER} showBalance={!isDriver} />
                    <UserInfo
                        user={dispatcher}
                        type={userRoleGroup === UserRoleGroup.SHIPPERS ? UserRoleType.SHIPPER_DISPATCHER : UserRoleType.CARRIER_DISPATCHER}
                    />
                </div>
            )}
        </>
    );
};
