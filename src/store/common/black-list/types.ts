import { PaymentTerm } from '@/enums/payment-term';
import { NullableFields } from '@/shared/nullable';

import { PaginatedResponse, RequestWithStatus } from '../../../utils/redux';

export type BlackListItem = {
    publicId: string;
    name: string;
    usdot: string;
    notes: string;
    createdAt: string;
    updatedAt: string;
    terms: PaymentTerm[] | null;
    roleTypes: ('drivers' | 'dispatchers')[] | null;
};

export type FetchedBlackListItems = PaginatedResponse<BlackListItem[]>;

export type TBlackListItemsFilters = NullableFields<{
    companyId?: string;
    query: string;
    orderName: string;
    orderDirection: string;
    page: number;
    perPage: number;
    lastPage: number;
    cursor?: string;
}> &
    Partial<{ to: number; from: number; total: number }>;

export type CreateEditBlackListItemModalState = {
    isVisible: boolean;
    mode: 'create' | 'edit' | null;
    blackListPublicId: string | null;
};

export type DeleteBlackListItemPopupState = {
    isVisible: boolean;
    blackListPublicId: string | null;
    blackListName: string | null;
};

export type BlackListSliceState = {
    fetchBlackListItems: RequestWithStatus<FetchedBlackListItems>;
    filters: TBlackListItemsFilters;
    createEditBlackListItemsFormSubmit: RequestWithStatus<any>;

    fetchBlackListItem: RequestWithStatus<BlackListItem>;
    createEditModal: CreateEditBlackListItemModalState;

    deleteBlackListItemPopup: DeleteBlackListItemPopupState;
    deleteBlackListItem: RequestWithStatus<any>;
};

export type CreateEditBlackListItemData = {
    companyId?: string;
    publicId?: string;
    name: string;
    usdot: string;
    notes: string;
    terms: string[];
    roleTypes: string[];
};

export type BlackListItemFormState = CreateEditBlackListItemData;
