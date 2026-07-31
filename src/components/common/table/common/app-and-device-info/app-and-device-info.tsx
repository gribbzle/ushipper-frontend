import React from 'react';

import { DeviceInformation } from '@store/common';
import { classname } from '@utils/classname';

import './app-and-device-info.scss';

const cn = classname('app-and-device-info');

export const AppAndDeviceInfo = ({ info }: { info: DeviceInformation | null }) => {
    if (!info?.applicationVersion && !info?.deviceModelName) {
        return <span className={cn()}>—</span>;
    }

    return (
        <div className={cn()}>
            <span>{info?.applicationVersion ?? '—'}</span>
            <span className={cn('model-name')}>{info?.deviceModelName ?? '—'}</span>
        </div>
    );
};
