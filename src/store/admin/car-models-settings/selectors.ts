type AppState = {
    admin: {
        carModelsSettings: any;
    };
};

const carModelsSettingsPageSelector = (state: AppState) => state.admin.carModelsSettings;

export const carModelsSelector = (state: AppState) => {
    const { fetchCarModels } = carModelsSettingsPageSelector(state);

    return fetchCarModels.data?.data ?? [];
};

export const carModelsFiltersSelector = (state: AppState) => {
    const { filters } = carModelsSettingsPageSelector(state);

    return filters;
};

export const createEditCarModelDrawerPropsSelector = (state: AppState) => {
    const { createEditCarModelDrawer } = carModelsSettingsPageSelector(state);

    return createEditCarModelDrawer;
};

export const fetchedCarModelSelector = (state: AppState) => {
    const { fetchCarModel } = carModelsSettingsPageSelector(state);

    return fetchCarModel.data;
};

export const deleteCarModelPopupPropsSelector = (state: AppState) => {
    const { deleteCarModelPopup } = carModelsSettingsPageSelector(state);

    return deleteCarModelPopup;
};

export const crudSearchCarMakersSelector = (state: AppState) => {
    const { crudSearchCarMakers } = carModelsSettingsPageSelector(state);

    return crudSearchCarMakers.data?.data;
};

export const filterSearchCarMakersSelector = (state: AppState) => {
    const { filterSearchCarMakers } = carModelsSettingsPageSelector(state);

    return filterSearchCarMakers.data?.data;
};

export const filterSearchCarMakersCalledSelector = (state: AppState) => {
    const { filterSearchCarMakers } = carModelsSettingsPageSelector(state);

    return filterSearchCarMakers.wasCalled;
};

export const carModelStatusesSelector = (state: AppState) => {
    const { fetchCarModelStatuses } = carModelsSettingsPageSelector(state);

    return fetchCarModelStatuses.data;
};

export const carModelStatusesRequestStatusSelector = (state: AppState) => {
    const { fetchCarModelStatuses } = carModelsSettingsPageSelector(state);

    return fetchCarModelStatuses.status;
};
