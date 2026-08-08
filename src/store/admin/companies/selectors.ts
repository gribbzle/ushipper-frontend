import { AppState } from "@store";

const companiesPageSelector = (state: AppState) => state.admin.companies;

export const fetchedCompaniesSelector = (state: AppState) => {
    const { fetchCompanies } = companiesPageSelector(state);

    return fetchCompanies.data?.data ?? [];
};

export const companiesRequestStatusSelector = (state: AppState) => {
    const { fetchCompanies } = companiesPageSelector(state);

    return fetchCompanies.status;
};

export const isCreateEditCompanyDrawerVisibleSelector = (state: AppState) => {
    const { createEditCompanyDrawer } = companiesPageSelector(state);

    return createEditCompanyDrawer.isVisible;
};

export const createEditCompanyDrawerModeSelector = (state: AppState) => {
    const { createEditCompanyDrawer } = companiesPageSelector(state);

    return createEditCompanyDrawer.mode;
};

export const companiesFiltersSelector = (state: AppState) => {
    const { filters } = companiesPageSelector(state);

    return filters;
};

export const fetchedCompanySelector = (state: AppState) => {
    const { fetchCompany } = companiesPageSelector(state);

    return fetchCompany.data;
};

export const deleteCompanyPopupPropsSelector = (state: AppState) => {
    const { deleteCompanyPopup } = companiesPageSelector(state);

    return deleteCompanyPopup;
};

export const companyReviewsTotalSelector = (state: AppState) => {
    const { fetchCompany } = companiesPageSelector(state);

    return fetchCompany.data?.reviewsTotal;
};

export const companyTotalRatingSelector = (state: AppState) => {
    const { companyTotalRating } = companiesPageSelector(state);

    return companyTotalRating;
};

export const companyAvgDetailsRatingSelector = (state: AppState) => {
    const { companyTotalRating } = companiesPageSelector(state);

    return companyTotalRating?.itemsAvg;
};

export const companyRatingsReviewCountArraySelector = (state: AppState) => {
    const { companyTotalRating } = companiesPageSelector(state);

    return companyTotalRating?.perScore;
};
