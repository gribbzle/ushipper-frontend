import { useHasPermission } from '../use-check-permission';

const ACTIONS_PERMISSION = { scope: 'adminPanelAccounting', functionality: 'admin_panel.carriers.actions' };

export const useCarriersActionsPermission = () => {
    const hasPermission = useHasPermission(ACTIONS_PERMISSION);

    return hasPermission;
};
