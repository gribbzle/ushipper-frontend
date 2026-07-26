export type AccountVerificationMode = 'email' | 'phone';

export type MarkAsVerifiedParams = {
    mode: AccountVerificationMode;
    accountId: string;
};
