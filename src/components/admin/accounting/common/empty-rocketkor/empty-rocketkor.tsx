import React from 'react';

import { AccountingZoneButton } from '@/components/admin/accounting/common/accounting-zone-button/accounting-zone-button';
import { useDriversActionsPermission } from '@hooks';
import { translateByNamespace } from '@utils/i18n';

import { EmptyRocketkorProps } from './empty-rocketkor.types';

const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:rocketkor');

export const EmptyRocketkor = ({ onChange }: EmptyRocketkorProps) => {
    const hasDriversActionsPermission = useDriversActionsPermission();

    return (
        <AccountingZoneButton text={t(hasDriversActionsPermission ? 'add' : 'no-wallet-profile')} onClick={onChange} disabled={!hasDriversActionsPermission} />
    );
};
