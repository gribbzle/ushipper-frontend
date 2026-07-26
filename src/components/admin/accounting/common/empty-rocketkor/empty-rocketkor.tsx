import React from 'react';

import { AccountingZoneButton } from '@/components';
import { useDriversActionsPermission } from '@hooks';
import { translateByNamespace } from '@utils';

import { EmptyRocketkorProps } from './empty-rocketkor.types';

const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:rocketkor');

export const EmptyRocketkor = ({ onChange }: EmptyRocketkorProps) => {
    const hasDriversActionsPermission = useDriversActionsPermission();

    return (
        <AccountingZoneButton text={t(hasDriversActionsPermission ? 'add' : 'no-wallet-profile')} onClick={onChange} disabled={!hasDriversActionsPermission} />
    );
};
