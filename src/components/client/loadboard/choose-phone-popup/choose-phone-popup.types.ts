import { LoadBoardFilters } from '@store/api/loadboard-api';
import { Load } from '@store/client';

export type ChoosePhonePopupProps = {
    order?: Load;
    onClose: () => void;
    loadBoardFilters: LoadBoardFilters;
    type?: 'call' | 'message';
    context?: 'drawer' | 'messages-page';
};
