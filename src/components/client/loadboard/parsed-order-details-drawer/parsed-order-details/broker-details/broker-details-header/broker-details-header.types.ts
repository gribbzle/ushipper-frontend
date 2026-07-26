import { LoadBoardFilters } from '@store/api/loadboard-api';
import { Load } from '@store/client';

export type BrokerDetailsHeaderProps = {
    order: Load;
    loadBoardFilters?: LoadBoardFilters;
};
