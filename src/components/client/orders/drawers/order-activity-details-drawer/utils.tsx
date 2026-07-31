import React from 'react';
import { enUS } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';
import { toSentenceCase } from 'js-convert-case';

import { getPaymentMethodTranslate, getPaymentTermTranslate } from '@/utils/payment';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { formatToCurrency } from '@utils/numbers';
import { getPaymentRecipientTranslate } from '@utils/translate/get-payment-recipient-translate';
import { translateFundsTransferStatus } from '@utils/translate/order/funds-transfer-status-translations';

const t = translateByNamespace('client:order:activity:activity-details-drawer');
const cn = classname('order-activity-details-drawer');

const toWords = (str: string) => str.replace(/_/g, ' ');
const isISODate = (str: string) => /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{6}Z/.test(str);

const formatDate = (date: string) => formatInTimeZone(new Date(date), 'America/Los_Angeles', 'dd.MM.yyyy HH:mm (zzz)', { locale: enUS });

const renderObject = (obj: Record<string, any>) => {
    return (
        <div className={cn('object-view')}>
            {Object.entries(obj).map(([key, value]) => (
                <p key={key}>
                    <span>{toSentenceCase(key)}:</span> {typeof value === 'object' && value !== null ? renderObject(value) : toWords(String(value))}
                </p>
            ))}
        </div>
    );
};

const keyHandlersMap: Record<string, (value: any) => string> = {
    driverFeeCharge: (value: any) => value.formatted,
    fundsTransferStatus: (value: any) => translateFundsTransferStatus(value),
    driverDelayedPayment: (value: any) => value.formatted,
    method: (value: any) => getPaymentMethodTranslate(value),
    instantTerm: (value: any) => getPaymentRecipientTranslate(value),
    terms: (value: any) => getPaymentTermTranslate(value),
    payment: (value: any) => formatToCurrency(value),
    brokerFee: (value: any) => formatToCurrency(value),
};

export const renderValue = (value: any, key: string) => {
    if (value === null) {
        return '—';
    }

    if (typeof value === 'string' && isISODate(value)) {
        return formatDate(value);
    }

    if (typeof value === 'boolean') {
        return value ? t('yes-value') : t('no-value');
    }

    for (const [mappedKey, handler] of Object.entries(keyHandlersMap)) {
        if (key.toLowerCase().includes(mappedKey.toLowerCase())) {
            return handler(value);
        }
    }

    if (typeof value === 'object' && value !== null) {
        return renderObject(value);
    }

    return toWords(String(value));
};
