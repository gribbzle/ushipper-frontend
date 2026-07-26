import React, { useMemo } from 'react';
import has from 'has-values';
import { toHeaderCase } from 'js-convert-case';

import { Ellipse } from '@icons';
import { ExternalInfo } from '@store/admin';
import { classname, getObjectWithoutEmptyFields, getTransactionSystemTranslate, translateByNamespace } from '@utils';

import './external-info.scss';

const t = translateByNamespace('admin:accounting:balance-table');
const cn = classname('external-info');

export const ExternalInfoBlock = ({ externalId, externalProvider, externalStatus }: ExternalInfo) => {
    const details = useMemo(
        () =>
            getObjectWithoutEmptyFields({
                externalProvider: externalProvider ? t('payment-provider', { provider: getTransactionSystemTranslate(externalProvider) }) : null,
                externalStatus:
                    externalStatus && externalProvider
                        ? t('payment-status-in', { provider: getTransactionSystemTranslate(externalProvider), status: toHeaderCase(externalStatus) })
                        : null,
            }),
        [externalProvider, externalStatus],
    );

    if (!has(details)) return null;

    return (
        <>
            <div className={cn('')}>
                {Object.values(details)
                    .filter((value): value is string => value !== null)
                    .map((value, index) => (
                        <div key={index} className={cn('')}>
                            {index > 0 && (
                                <span className={cn('', { ellipse: true })}>
                                    <Ellipse />
                                </span>
                            )}
                            {value}
                        </div>
                    ))}
            </div>
            {externalId && <p>{t('external-id', { id: externalId })}</p>}
        </>
    );
};
