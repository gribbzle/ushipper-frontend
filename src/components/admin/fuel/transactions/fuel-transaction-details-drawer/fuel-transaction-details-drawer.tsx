import React, { Fragment, useMemo } from 'react';
import has from 'has-values';

import { Divider, Drawer } from '@/components/common';
import { DotLeader } from '@ui';
import { classname } from '@utils/classname';
import { formatDate } from '@utils/dates';
import { translateByNamespace } from '@utils/i18n';
import { translateBooleanOrFormatValue } from '@utils/translations';

import { useFuelTransactionDetailsDrawer } from './use-fuel-transaction-details-drawer';

import './fuel-transaction-details-drawer.scss';

const t = translateByNamespace('admin:fuel:transactions-page:fuel-transaction-details-drawer');
const cn = classname('fuel-transaction-details-drawer');

const isISODate = (str: string) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(str);

const formatValue = (value: unknown): string | number => {
    if (typeof value === 'string' && isISODate(value)) {
        return formatDate(value) ?? t('no-details');
    }

    const formattedValue = translateBooleanOrFormatValue(value);

    return has(formattedValue) ? formattedValue : t('no-details');
};

const renderObjectContent = (divider: string | number, value: Record<string, any>): React.ReactNode => {
    return (
        <Fragment key={divider}>
            <Divider lineStyle='solid'>{divider}</Divider>
            {Object.entries(value).map(([nestedKey, nestedValue]) => renderNestedContent(nestedKey, nestedValue))}
        </Fragment>
    );
};

const renderNestedContent = (key: string, value: any): React.ReactNode => {
    if (Array.isArray(value)) {
        if (key === 'infos') {
            return (
                <Fragment key={key}>
                    <Divider lineStyle='solid'>{t(key)}</Divider>
                    {value.map((item, index) => {
                        if (typeof item === 'object' && item !== null) {
                            const type = item['type'];
                            const formattedValue = formatValue(item['value']);

                            return <DotLeader key={`${key}-${index}`} label={t(type)} value={formattedValue} />;
                        }

                        return null;
                    })}
                </Fragment>
            );
        }

        const containsObjects = value.every(item => typeof item === 'object' && item !== null);

        if (containsObjects) {
            return (
                <Fragment key={key}>
                    <Divider lineStyle='solid'>{t(key)}</Divider>
                    {value.map((item, index) => renderObjectContent(index + 1, item))}
                </Fragment>
            );
        }

        return null;
    }

    if (typeof value === 'object' && value !== null) {
        return renderObjectContent(t(key), value);
    }

    return <DotLeader key={key} label={t(key)} value={formatValue(value)} />;
};

export const FuelTransactionDetailsDrawer = () => {
    const { isPopupOpened, fuelTransaction, handleCloseDraw3er } = useFuelTransactionDetailsDrawer();

    const description = useMemo(() => {
        if (!fuelTransaction?.rawData) {
            return <div className={cn('empty')}>{t('no-information')}</div>;
        }

        const entries = Object.entries(fuelTransaction.rawData);

        const simpleEntries = entries.filter(([, value]) => typeof value !== 'object' || value === null);
        const complexEntries = entries.filter(([, value]) => typeof value === 'object' && value !== null);

        return (
            <div className={cn('list')}>
                {simpleEntries.map(([key, value]) => renderNestedContent(key, value))}
                {complexEntries.map(([key, value]) => renderNestedContent(key, value))}
            </div>
        );
    }, [fuelTransaction?.rawData]);

    return (
        <Drawer
            className={cn()}
            isOpen={isPopupOpened}
            onClose={handleCloseDraw3er}
            head={t('title', { number: fuelTransaction?.externalId ? `#${fuelTransaction.externalId}` : '' })}
            body={description}
        />
    );
};
