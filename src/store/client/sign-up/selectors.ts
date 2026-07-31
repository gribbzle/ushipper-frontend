type AppState = {
    client: {
        signUp: any;
    };
};

const signUpPageSelector = (state: AppState) => state.client.signUp;

export const signUpFormSubmitStatusSelector = (state: AppState) => {
    const {
        signUpFormSubmit: { status },
    } = signUpPageSelector(state);

    return status;
};

export const signUpConfirmationStatusSelector = (state: AppState) => {
    const {
        signUpConfirmation: { status },
    } = signUpPageSelector(state);

    return status;
};

export const confirmationMethodsSelector = (state: AppState) => {
    const {
        fetchSignUpConfig: { data },
    } = signUpPageSelector(state);

    return data?.confirmationMethods;
};

export const usdotVerifyFormSubmitErrorCodeSelector = (state: AppState) => {
    const {
        requestUSDOTVerifyFormSubmit: { errorCode },
    } = signUpPageSelector(state);

    return errorCode;
};

export const usdotVerifyFormSubmitErrorDataSelector = (state: AppState) => {
    const {
        requestUSDOTVerifyFormSubmit: { error },
    } = signUpPageSelector(state);

    return error?.errors?.data;
};
