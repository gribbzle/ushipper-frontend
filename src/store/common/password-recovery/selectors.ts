import { AppState } from '@store';

export const passwordRecoverySelector = (state: AppState) => state.common.passwordRecovery;

export const requestResetFormSubmitStatusSelector = (state: AppState) => {
    const {
        requestResetFormSubmit: { status },
    } = passwordRecoverySelector(state);

    return status;
};

export const requestResetFormErrorSelector = (state: AppState) => {
    const {
        requestResetFormSubmit: { error },
    } = passwordRecoverySelector(state);

    return error?.message;
};

export const resetPasswordFormSubmitStatusSelector = (state: AppState) => {
    const {
        resetPasswordFormSubmit: { status },
    } = passwordRecoverySelector(state);

    return status;
};

export const resetPasswordFormSubmitErrorMessageSelector = (state: AppState) => {
    const { resetPasswordFormSubmit } = passwordRecoverySelector(state);

    return resetPasswordFormSubmit.error?.message as string | undefined;
};
