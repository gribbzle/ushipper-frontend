import { toSnakeCase } from 'js-convert-case';

import { SavedSearch } from '@/api/types';
import { CoordinatesWithRangeRegion, SavedLoadBoardFilters } from '@store/api/loadboard-api';
import { axios } from '@utils/axios';
import { PaginatedRequest, PaginatedResponse } from '@utils/redux';

export type SavedLoadboardSearch = SavedSearch<'load_board', SavedLoadBoardFilters>;

const processFilters = (filters: SavedLoadBoardFilters) => {
    const processCoordinates = (location: CoordinatesWithRangeRegion) => {
        const { latitude, longitude, region, ...rest } = location;

        return {
            ...rest,
            latitude: typeof latitude === 'string' ? null : latitude,
            longitude: typeof longitude === 'string' ? null : longitude,
            region: region ? toSnakeCase(region) : region,
        };
    };

    const { origins, destinations, ...restFilters } = filters;

    return {
        ...restFilters,
        origins: origins?.map(processCoordinates),
        destinations: destinations?.map(processCoordinates),
    };
};

export const getLoadboardSavedSearches = (filters: PaginatedRequest): Promise<PaginatedResponse<SavedLoadboardSearch[]>> => {
    return axios
        .get('/api/saved-searches', {
            params: filters,
        })
        .then(res => res.data.data);
};

export const createLoadBoardSearch = (name: string, filters: SavedLoadBoardFilters): Promise<SavedLoadboardSearch> => {
    return axios
        .post('/api/saved-searches', {
            name: name,
            type: 'load_board',
            filters: processFilters(filters),
        })
        .then(res => res.data.data);
};

export const removeLoadboardSearch = (searchId: string): Promise<void> => {
    return axios.delete(`/api/saved-searches/${searchId}`);
};

export const updateLoadboardSearch = (
    searchId: string,
    name: string,
    filters: SavedLoadBoardFilters,
): Promise<SavedSearch<'load_board', SavedLoadBoardFilters>> => {
    return axios
        .patch(`/api/saved-searches/${searchId}`, {
            name,
            type: 'load_board',
            filters: processFilters(filters),
        })
        .then(res => res.data.data);
};
