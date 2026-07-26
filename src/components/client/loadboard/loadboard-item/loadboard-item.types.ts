import { LoadBoardFilters } from '@store/api/loadboard-api';
import { Load } from '@store/client';

export type LoadboardItemProps = {
    order: Load;
    tagged: boolean;
    loadBoardFilters: LoadBoardFilters;
};
