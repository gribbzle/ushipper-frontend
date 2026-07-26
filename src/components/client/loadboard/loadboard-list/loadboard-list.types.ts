import { LoadBoardFilters } from '@store/api/loadboard-api';
import { Load } from '@store/client';

export type LoadboardListProps = {
    orders: Load[];
    loadBoardFilters: LoadBoardFilters;
};
