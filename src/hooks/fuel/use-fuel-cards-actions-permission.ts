import { useHasPermission } from '../use-check-permission';

const ACTIONS_PERMISSION = { scope: 'fuelCards', functionality: 'admin_panel.fuel_cards.cards.actions' };

export const useFuelCardsActionsPermission = () => {
    const hasPermission = useHasPermission(ACTIONS_PERMISSION);

    return hasPermission;
};
