import { Creator } from '@/shared';
import { PaginatedData, RequestWithStatus } from '@utils';

import { CarMaker } from '../car-makers-settings';

export type CarModel = {
    id: number;
    maker: string;
    name: string;
    status: string;
    updatedAt: string;
    weight: string | null;
    createdAt: string;
    createdBy: Creator;
};

export type CarModelsFilters = {
    page: number;
    perPage: number;
    lastPage: number | null;
    modelName: string | null;
    makerId: string | null;
    status: string | null;
    orderName: string | null;
    orderDirection: string | null;
    to?: number;
    from?: number;
    total?: number;
};

export type CreateEditCarModelDrawerState = {
    isVisible: boolean;
    mode: 'create' | 'edit' | null;
    carModelId: number | null;
    carModelName: string | null;
};

export type DeleteCarModelPopupState = {
    isVisible: boolean;
    carModelId: number | null;
    carModelName: string | null;
};

export type CarModelsSettingsSliceState = {
    fetchCarModels: RequestWithStatus<PaginatedData<CarModel[]>>;
    filters: CarModelsFilters;
    filterSearchCarMakers: RequestWithStatus<PaginatedData<CarMaker[]>>;
    fetchCarModelStatuses: RequestWithStatus<string[]>;

    createEditCarModelDrawer: CreateEditCarModelDrawerState;
    createEditCarModel: RequestWithStatus<any>;
    fetchCarModel: RequestWithStatus<any>;
    crudSearchCarMakers: RequestWithStatus<any>;

    deleteCarModelPopup: DeleteCarModelPopupState;
    deleteCarModel: RequestWithStatus<any>;
};
