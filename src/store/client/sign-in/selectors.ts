import { AppState } from '@store';

const signInPageSelector = (state: AppState) => state.client.signIn;

export const signInFormSubmitStatusSelector = (state: AppState) => {
    const {
        signInFormSubmit: { status },
    } = signInPageSelector(state);

    return status;
};

export const signInFormSubmitErrorMessageSelector = (state: AppState) => {
    const {
        signInFormSubmit: { error },
    } = signInPageSelector(state);

    return error?.message;
};
