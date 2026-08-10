import { BalanceType } from '@/enums/balance-type';
import { PaymentConfirmationType } from '@/enums/transactions/payment-confirmation-type';

const externalWalletTypes = new Set([BalanceType.EXTERNAL_BANK_WALLET, BalanceType.EXTERNAL_CARD_WALLET]);

export const isCashOut = ({ confirmation, destinationType }: { confirmation: PaymentConfirmationType; destinationType?: BalanceType }): boolean =>
    confirmation === PaymentConfirmationType.MANUAL_TRANSACTION && destinationType ? externalWalletTypes.has(destinationType) : false;

export const isCashIn = ({ confirmation, sourceType }: { confirmation: PaymentConfirmationType; sourceType?: BalanceType }): boolean =>
    confirmation === PaymentConfirmationType.MANUAL_TRANSACTION && sourceType ? externalWalletTypes.has(sourceType) : false;
