import React from 'react';

import { EmptyLayout } from '@/components/common/empty-layout/empty-layout';
import { AccessForbiddenBlock } from '@/components/common/main-layout/access-forbidden-block';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { DriverItem } from '../driver-item';

import { useDriversList } from './use-drivers-list';

import './drivers-list.scss';

const cn = classname('drivers-list');
const t = translateByNamespace('client:drivers-plan');

export const DriversList = () => {
    const { drivers, isSuccess, isError, error } = useDriversList();

    if (drivers?.length) {
        return (
            <div className={cn()}>
                {drivers.map((driver, index) => (
                    <DriverItem key={driver.publicId} driver={driver} isClose={index !== 0} />
                ))}
            </div>
        );
    }

    if (isError && (error as any).status === 403) {
        return <AccessForbiddenBlock />;
    }

    if (!isSuccess) {
        return null;
    }

    return <EmptyLayout title={t('no-data-title')} subTitle='' />;
};
