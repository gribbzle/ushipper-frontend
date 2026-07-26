import { AppState } from '@store';

const carMakersSettingsPageSelector = (state: AppState) => state.admin.carMakersSettings;

export const carMakersSelector = (state: AppState) => {
    const { fetchCarMakers } = carMakersSettingsPageSelector(state);

    return fetchCarMakers.data?.data ?? [];
};

export const carMakersFiltersSelector = (state: AppState) => {
    const { filters } = carMakersSettingsPageSelector(state);

    return filters;
};

export const createEditCarMakerDrawerPropsSelector = (state: AppState) => {
    const { createEditCarMakerDrawer } = carMakersSettingsPageSelector(state);

    return createEditCarMakerDrawer;
};

export const fetchedCarMakerSelector = (state: AppState) => {
    const { fetchCarMaker } = carMakersSettingsPageSelector(state);

    return fetchCarMaker.data;
};

export const deleteCarMakerPopupPropsSelector = (state: AppState) => {
    const { deleteCarMakerPopup } = carMakersSettingsPageSelector(state);

    return deleteCarMakerPopup;
};
