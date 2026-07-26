export type RequestResetPasswordData = {
    email: string;
};

export type ResetPasswordData = {
    newPassword: string;
    newPasswordConfirmation: string;
    verifyCode: string;
};
