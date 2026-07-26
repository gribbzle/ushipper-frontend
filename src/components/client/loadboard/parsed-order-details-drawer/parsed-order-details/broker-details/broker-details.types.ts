import { LoadBoardFilters } from '@store/api/loadboard-api';
import { Load } from '@store/client';

export type BrokerDetailsProps = {
    order: Load;
    loadBoardFilters?: LoadBoardFilters;
};
