import { useHasPermission } from '../use-check-permission';

const ACTIONS_PERMISSION = { scope: 'adminPanelAccounting', functionality: 'admin_panel.drivers.actions' };

export const useDriversActionsPermission = () => {
    const hasPermission = useHasPermission(ACTIONS_PERMISSION);

    return hasPermission;
};
