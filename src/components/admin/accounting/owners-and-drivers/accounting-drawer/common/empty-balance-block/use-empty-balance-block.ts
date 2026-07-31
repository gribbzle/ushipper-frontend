import { useMemo } from 'react';

import { useDriversActionsPermission } from '@hooks';
import { useAppSelector } from '@store';
import { selectedAccountSelector } from '@store/admin';
import { translateByNamespace } from '@utils/i18n';
import { renderTextWithBreakLines } from '@utils/render';

import { useHandleEmptyRocketkorClick } from '../../hooks/use-handle-empty-rocketkor-click';

const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:account-balance');
const tDefault = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer');

export const useEmptyAccountBalanceBlock = () => {
    const account = useAppSelector(selectedAccountSelector);
    const hasDriversActionsPermission = useDriversActionsPermission();

    const alertText = useMemo(() => {
        const name = account?.name ? account.name : tDefault('default-title');
        const alertKey = hasDriversActionsPermission ? 'empty-account-balance-text-alert' : 'short-empty-account-balance-text-alert';
        const message = t(alertKey, { name });

        return hasDriversActionsPermission ? renderTextWithBreakLines(message) : message;
    }, [account, hasDriversActionsPermission]);

    const { handleEmptyRocketkorClick } = useHandleEmptyRocketkorClick();

    return { hasDriversActionsPermission, alertText, handleEmptyRocketkorClick };
};
