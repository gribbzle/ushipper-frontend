import { SavedLoadBoardFilters } from '@store/api/loadboard-api';

export type LoadboardFiltersProps = {
    filters: SavedLoadBoardFilters;
    filtersChanged: (e: SavedLoadBoardFilters) => void;
};
