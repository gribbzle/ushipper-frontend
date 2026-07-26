import { useHasPermission } from '../use-check-permission';

const ACTIONS_PERMISSION = { scope: 'adminPanel', functionality: 'admin_panel.companies.actions' };

export const useCompaniesActionsPermission = () => {
    const hasPermission = useHasPermission(ACTIONS_PERMISSION);

    return hasPermission;
};
