import { translateByNamespace } from '@/utils/i18n';
import { IssueStatus } from '@/enums/issues/issue-status';
import { CancelRollbackTransactionMode } from '@store/admin/accounting/types';

const t = translateByNamespace('admin:accounting:notifications');

export const translateAlertSuccessNotification = (status: IssueStatus): string => t(`${status}-alert-status-success`);
export const translateAlertErrorNotification = (status: IssueStatus): string => t(`${status}-alert-status-error`);
export const translateExternalSettingsSuccess = (): string => t('add-external-service-settings-success');
export const translateTransactionStatusSuccess = (mode: CancelRollbackTransactionMode): string => t(`${mode}-transaction-status-success`);
export const translateTransactionStatusError = (mode: CancelRollbackTransactionMode): string => t(`${mode}-transaction-status-error`);

export const translateDriverPayoutStatusSuccess = (isPayToDriver: boolean): string =>
    t(isPayToDriver ? 'pay-to-driver-success' : 'payment-to-driver-declined-success');

export const translateDriverPayoutStatusError = (isPayToDriver: boolean): string =>
    t(isPayToDriver ? 'pay-to-driver-error' : 'payment-to-driver-declined-error');
