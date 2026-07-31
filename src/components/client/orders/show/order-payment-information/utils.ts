import { translateByNamespace } from '@utils/i18n';
import { formatToCurrency } from '@utils/numbers';

const t = translateByNamespace('client:order:payment-information');

export const getDelayedPayment = ({
    isBothTermsOrder,
    driverDelayedPayment,
    delayedPayment,
}: {
    isBothTermsOrder: boolean;
    driverDelayedPayment?: string | null;
    delayedPayment?: number | null;
}): string => {
    if (isBothTermsOrder && driverDelayedPayment) {
        return driverDelayedPayment;
    }

    if (delayedPayment) {
        return formatToCurrency(delayedPayment);
    }

    return t('empty-value');
};
