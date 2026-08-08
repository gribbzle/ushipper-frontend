import { AppState } from "@store";

const specializationsStateSelector = (state: AppState) => state.common.specializations;

export const fetchedSpecializationsSelector = (state: AppState) => {
    const { specializations } = specializationsStateSelector(state);

    return specializations;
};

export const specializationByIdSelector = (specializationId: number) => (state: AppState) => {
    const { specializations } = specializationsStateSelector(state);

    return specializations.find(specialization => specialization.id === specializationId);
};
