import { translateByNamespace } from '@utils';

import { AccountVerificationMode } from './owners-and-drivers-table.types';

const t = translateByNamespace('admin:accounting:notifications');

export const translateAccountVerificationSuccess = (mode: AccountVerificationMode): string => t(`updated-account-${mode}-verified-success`);

export const translateAccountVerificationError = (mode: AccountVerificationMode): string => t(`updated-account-${mode}-verified-error`);
