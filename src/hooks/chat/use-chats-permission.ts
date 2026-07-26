import { useHasPermission } from '../use-check-permission';

const CHATS_PERMISSION = { scope: 'adminPanel', functionality: 'admin_panel.chats.view_any' };

export const useChatsPermission = () => {
    const hasPermission = useHasPermission(CHATS_PERMISSION);

    return hasPermission;
};
