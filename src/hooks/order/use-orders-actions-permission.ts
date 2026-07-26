import { useHasPermission } from '../use-check-permission';

const ACTIONS_PERMISSION = { scope: 'adminPanel', functionality: 'admin_panel.orders.actions' };

export const useOrdersActionsPermission = () => {
    const hasPermission = useHasPermission(ACTIONS_PERMISSION);

    return hasPermission;
};
