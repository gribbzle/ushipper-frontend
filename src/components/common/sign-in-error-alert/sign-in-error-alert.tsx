import React from 'react';

import { SignInErrorMessages } from '@/enums';
import { AlertBlock } from '@components';
import { renderTextWithBreakLines, translateByNamespace } from '@utils';

const t = translateByNamespace('common:sign-in-page');

const SIGN_IN_ERRORS_MAP = new Map<string, string>([
    [SignInErrorMessages.BE_CONFIRM_EMAIL_ERROR_TEXT, t('confirm-email-error')],
    [SignInErrorMessages.BE_INVALID_EMAIL_PWD_ERROR_TEXT, t('incorrect-login-or-password')],
    [SignInErrorMessages.BE_INVALID_LOGIN_PWD_ERROR_TEXT, t('incorrect-login-or-password')],
    [SignInErrorMessages.BE_NO_RIGHTS_ERROR_TEXT, t('no-rights')],
]);

export const SignInErrorAlert = ({ error }: { error?: string | null }) => {
    if (!error) {
        return null;
    }

    const foundErrorEntry = Array.from(SIGN_IN_ERRORS_MAP.entries()).find(([key]) => error.includes(key));
    const translatedError = foundErrorEntry ? foundErrorEntry[1] : error;

    return <AlertBlock view='warning'>{renderTextWithBreakLines(translatedError)}</AlertBlock>;
};
