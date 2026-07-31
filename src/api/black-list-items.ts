import { axios } from '@utils/axios';

import { CreateEditBlackListItemData, FetchedBlackListItems, TBlackListItemsFilters } from '../store/common/black-list/types';

export const fetchBlackListItems = async (filters: TBlackListItemsFilters) => {
    const result = await axios.get('/api/blacklist-items', { params: filters });

    return result.data.data as FetchedBlackListItems;
};

export const createEditBlackListItem = async (mode: 'create' | 'edit', blackListItem: CreateEditBlackListItemData) => {
    const result = await axios({
        url: mode === 'create' ? '/api/blacklist-items' : `/api/blacklist-items/${blackListItem.publicId}`,
        method: mode === 'create' ? 'POST' : 'PATCH',
        data: blackListItem,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return result.data;
};

export const fetchBlackListItem = async (blackListItemPublicId: string) => {
    const result = await axios.get(`/api/blacklist-items/${blackListItemPublicId}`);

    return result.data.data;
};

export const deleteBlackListItem = async (blackListItemPublicId: string) => {
    const result = await axios.delete(`/api/blacklist-items/${blackListItemPublicId}`);

    return result.data;
};
