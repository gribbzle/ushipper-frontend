import { Creator } from '@/shared';
import { PaginatedData, RequestWithStatus } from '@utils';

export type CarMakersFilters = {
    page: number;
    perPage: number;
    lastPage: number | null;
    name: string | null;
    orderName: string | null;
    orderDirection: string | null;
    status: string | null;
    to?: number;
    from?: number;
    total?: number;
};

export type CreateEditCarMakerDrawerState = {
    isVisible: boolean;
    mode: 'create' | 'edit' | null;
    carMakerId: number | null;
    carMakerName: string | null;
};

export type DeleteCarMakerPopupState = {
    isVisible: boolean;
    carMakerId: number | null;
    carMakerName: string | null;
};

export type CarMakersSettingsSliceState = {
    fetchCarMakers: RequestWithStatus<PaginatedData<CarMaker[]>>;
    filters: CarMakersFilters;

    createEditCarMakerDrawer: CreateEditCarMakerDrawerState;
    createUpdateCarMaker: RequestWithStatus<any>;
    fetchCarMaker: RequestWithStatus<CarMaker>;

    deleteCarMakerPopup: DeleteCarMakerPopupState;
    deleteCar: RequestWithStatus<any>;
};

export type CarMaker = {
    id: number;
    name: string;
    modelsCount: number;
    status: string;
    createdBy: Creator;
    createdAt: string;
    updatedAt: string;
};
