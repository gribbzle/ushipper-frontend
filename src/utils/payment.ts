import { toKebabCase } from 'js-convert-case';

import { PaymentMethod, PaymentTerm } from '@/enums';
import { convertMetersToMiles } from '@/utils/converter';
import { translateByNamespace } from '@/utils/i18n';
import { formatToCurrency } from '@/utils/numbers';
import { OrderPaymentInformation } from '@store/client';

import { isFreightX } from './project-config';

const paymentTermTranslate = translateByNamespace('common:payment-terms');
const paymentMethodTranslate = translateByNamespace('common:payment-methods');
const unitsOfMeasurementTranslate = translateByNamespace('common:units-of-measurement');

export const getPaymentTermTranslate = (term: PaymentTerm): string => {
    if (isFreightX && term === PaymentTerm.BUSINESS_DAYS_30) {
        return paymentTermTranslate('factoring');
    }

    return paymentTermTranslate(toKebabCase(term));
};

export const getShortPaymentTermTranslate = (term: PaymentTerm): string => getPaymentTermTranslate(term).replace('Business ', '');

export const getPaymentMethodTranslate = (method: PaymentMethod | 'ach' | 'uship'): string => paymentMethodTranslate(toKebabCase(method));

const getPaymentPerDistanceValue = (payment: number, distance: number | undefined) => payment / convertMetersToMiles(distance ?? 1);

export const getPaymentPerDistance = (payment: number, distance: number | undefined) =>
    unitsOfMeasurementTranslate('per-miles', { value: formatToCurrency(getPaymentPerDistanceValue(payment, distance)) });

export const getPaymentPerDistanceWithoutCurrency = (payment: number, distance: number | undefined) =>
    unitsOfMeasurementTranslate('per-miles', {
        value: getPaymentPerDistanceValue(payment, distance).toLocaleString('en-US'),
    });

export const getPaymentPerDistancePerVehicleValue = (payment: number, distance: number | undefined, numOfVehicles: number) => {
    const perMile = getPaymentPerDistanceValue(payment, distance);

    return formatToCurrency(numOfVehicles > 0 ? perMile / numOfVehicles : perMile);
};

export const getPaymentPerDistancePerVehicle = (payment: number, distance: number | undefined, numOfVehicles: number) =>
    unitsOfMeasurementTranslate('per-miles', { value: getPaymentPerDistancePerVehicleValue(payment, distance, numOfVehicles) });

export const getPaymentPerDistanceDetails = (payment: number, distance: number | undefined, numOfVehicles: number) => ({
    mileCostPerVehicleWithMi: getPaymentPerDistancePerVehicle(payment, distance, numOfVehicles),
    mileCostPerOrderWithMi: getPaymentPerDistance(payment, distance),
    mileCostPerOrder: formatToCurrency(getPaymentPerDistanceValue(payment, distance)),
    mileCostPerVehicle: getPaymentPerDistancePerVehicleValue(payment, distance, numOfVehicles),
});

export const getPaymentWithType = (payment: number, type: PaymentMethod | null | undefined) =>
    `${formatToCurrency(payment)}` + (type ? ` (${getPaymentMethodTranslate(type)})` : '');

export const getFinalPaymentAmount = (payment?: number | null, delayedPayment?: number | null, brokerFee?: number | null) => {
    const paymentPrice = payment ?? 0;
    const delayedPrice = delayedPayment ?? 0;
    const preparedBrokerFee = brokerFee ?? 0;

    return paymentPrice + delayedPrice - preparedBrokerFee;
};

type CalculateTotalPaymentProps = Partial<Pick<OrderPaymentInformation, 'payment' | 'delayedPayment' | 'brokerFee'>>;

export const calculateTotalPayment = ({ payment, delayedPayment, brokerFee }: CalculateTotalPaymentProps) =>
    getFinalPaymentAmount(payment, delayedPayment, brokerFee);

export const getFormattedToCurrencyTotalPayment = (props: CalculateTotalPaymentProps) => formatToCurrency(calculateTotalPayment(props));
