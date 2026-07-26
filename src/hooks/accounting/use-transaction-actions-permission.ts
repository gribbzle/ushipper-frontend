import { useHasPermission } from '../use-check-permission';

const ACTIONS_PERMISSION = { scope: 'adminPanelAccounting', functionality: 'admin_panel.transactions.actions' };

export const useTransactionActionsPermission = () => {
    const hasPermission = useHasPermission(ACTIONS_PERMISSION);

    return hasPermission;
};
