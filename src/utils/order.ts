import { enUS } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';
import has from 'has-values';

import { OrderStatus } from '@/enums/order-status';
import { PaymentMethod } from '@/enums/payment-method';
import { PaymentTerm } from '@/enums/payment-term';
import { formatLongDateOrNull } from '@/utils/dates';
import { translateByNamespace } from '@/utils/i18n';
import { formatToCurrency } from '@/utils/numbers';
import { getObjectWithoutEmptyFields } from '@/utils/objects';
import { getPaymentMethodTranslate, getPaymentTermTranslate } from '@/utils/payment';
import {
    Load,
    OrderCustomerInformation,
    OrderDeliveryInformation,
    OrderInformation,
    OrderPaymentInformation,
    OrderPickupInformation,
    ShipperTrackingOrder,
} from '@store/client';

const t = translateByNamespace('common:order');

export const getAddress = ({ city, state, zip }: OrderInformation): string => {
    const address = getObjectWithoutEmptyFields({
        city,
        state,
        zip,
    });

    return has(address)
        ? Object.values(address)
              .reduce<string>((acc, value, index) => {
                  if (index === 0) return acc + value + ', ';

                  return acc + value + ' ';
              }, '')
              .slice(0, -1)
        : t('no-data');
};

export const hasAddress = ({ city, state, zip }: Partial<OrderInformation>): boolean => {
    const address = getObjectWithoutEmptyFields({
        city,
        state,
        zip,
    });

    return has(address);
};

export const getOrderTermWithMethod = (paymentTerm: PaymentTerm, paymentMethod: PaymentMethod): string =>
    t('term-with-method', { term: getPaymentTermTranslate(paymentTerm), method: getPaymentMethodTranslate(paymentMethod) });

export const getPaymentTermsTranslate = (paymentTerms: (PaymentTerm | null | undefined)[]): string =>
    paymentTerms
        .filter(Boolean)
        .map(term => getPaymentTermTranslate(term!))
        .join(', ');

export const getOrderPriceWithTerms = (paymentAmount: number, paymentTerms: (PaymentTerm | null | undefined)[]): string =>
    t('payment-with-terms', { payment: formatToCurrency(paymentAmount), terms: getPaymentTermsTranslate(paymentTerms) });

export const getPaymentsTermsTranslate = (paymentInformation: OrderPaymentInformation): string => {
    const { terms, method, delayedPayment, delayedTerms, delayedMethod } = paymentInformation;

    const termsArray = [
        terms && method ? getOrderTermWithMethod(terms, method) : null,
        delayedPayment && delayedTerms && delayedMethod ? getOrderTermWithMethod(delayedTerms, delayedMethod) : null,
    ];

    return termsArray.filter(Boolean).join(' / ');
};

export const getParsedOrderPriceWithTermsAndMethods = (paymentAmount: number, paymentInformation: OrderPaymentInformation): string =>
    t('payment-with-terms', { payment: formatToCurrency(paymentAmount), terms: getPaymentsTermsTranslate(paymentInformation) });

export const hasOrderPickupAddress = (pickupInformation: OrderPickupInformation) => hasAddress(pickupInformation);

export const hasOrderDeliveryAddress = (deliveryInformation: OrderDeliveryInformation) => hasAddress(deliveryInformation);

export const getOrderPickupAddress = (pickupInformation: OrderPickupInformation) => getAddress(pickupInformation);

export const getOrderDeliveryAddress = (deliveryInformation: OrderDeliveryInformation) => getAddress(deliveryInformation);

export const getOrderCustomerAddress = (customerInformation: OrderCustomerInformation) => getAddress(customerInformation);

type Information = {
    name?: string;
    phone?: string;
    streetAddress?: string;
    address?: string;
    scheduledAt?: string;
    fullName?: string;
};

type OrderInformationProps = {
    information: OrderInformation;
    status?: OrderStatus;
    pickedUpAt?: string | null;
    deliveredAt?: string | null;
    pickedUpAtTimezone?: string | null;
    deliveredAtTimezone?: string | null;
};

export const getOrderInformation = ({
    information,
    status,
    pickedUpAt,
    deliveredAt,
    pickedUpAtTimezone,
    deliveredAtTimezone,
}: OrderInformationProps): Information => {
    if ('customerName' in information) {
        return getObjectWithoutEmptyFields({
            name: information.customerName,
            phone: information.phone ? t('phone-label', { phone: information.phone }) : null,
        });
    }

    const date = 'scheduledPickupAt' in information ? information.scheduledPickupAt : information.scheduledDeliveryAt;

    return getObjectWithoutEmptyFields({
        name: information.businessName,
        streetAddress: information.streetAddress,
        address: getAddress(information),
        scheduledAt: getScheduledAtInfo({ date, status, pickedUpAt, deliveredAt, pickedUpAtTimezone, deliveredAtTimezone }),
        fullName: information.fullName,
        phone: information.phone ? t('phone-label', { phone: information.phone }) : null,
    });
};

type GetScheduledAtInfoProps = {
    date: string | null;
    status?: OrderStatus;
    pickedUpAt?: string | null;
    deliveredAt?: string | null;
    pickedUpAtTimezone?: string | null;
    deliveredAtTimezone?: string | null;
};

export const getScheduledAtInfo = ({
    date,
    status,
    pickedUpAt,
    deliveredAt,
    pickedUpAtTimezone,
    deliveredAtTimezone,
}: GetScheduledAtInfoProps): string | null => {
    if ((status === OrderStatus.PICKED_UP || status === OrderStatus.DELIVERED) && pickedUpAt) {
        return `${t('scheduled-at', {
            date: formatInTimeZone(new Date(pickedUpAt), pickedUpAtTimezone || 'America/Los_Angeles', 'MMMM d, yyyy hh:mm a (zzz)', { locale: enUS }),
        })}`;
    }

    if (status === OrderStatus.DELIVERED && deliveredAt) {
        return `${t('scheduled-at', {
            date: formatInTimeZone(new Date(deliveredAt), deliveredAtTimezone || 'America/Los_Angeles', 'MMMM d, yyyy hh:mm a (zzz)', { locale: enUS }),
        })}`;
    }

    return formatLongDateOrNull(date);
};

export const getOrderIdLabel = (orderId: string | null): string => (orderId?.trim() ? t('order-id-label', { orderId }) : t('no-order-id'));

export const getOrderId = (order: Load | ShipperTrackingOrder): string =>
    order.details.orderId && order.details.orderId.trim() !== '' ? order.details.orderId : t('no-order-id');

export const getCopyToCustomerState = (stateValues: Record<string, any>, prefix: string, value?: string, key?: string) => {
    if (!stateValues[`${prefix}`]) {
        return false;
    }
    const keysToCheck = ['businessName', 'streetAddress', 'city', 'state', 'city', 'zip', 'fullName', 'phone', 'email'];

    if (key) {
        return !!keysToCheck.find(keyToCheck => {
            if (key === keyToCheck) {
                return value;
            }

            return stateValues[`${prefix}`][keyToCheck];
        });
    }

    return !!keysToCheck.find(key => {
        return stateValues[`${prefix}`][key];
    });
};
