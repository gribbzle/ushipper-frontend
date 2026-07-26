import React from 'react';
import { format } from 'date-fns';

import { useCountriesAndStates } from '@hooks';
import { AccountingProfileDocument } from '@store/api/accounts-api';
import { classname, translateByNamespace } from '@utils';

import './extended-document-body.scss';

const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:rocketkor');
const cn = classname('extended-document-body');

export const ExtendedDocumentBody = ({ document }: { document: AccountingProfileDocument }) => {
    const { states, countries } = useCountriesAndStates(document.country);

    const country = countries?.find(country => country.alpha3 === document.country);
    const state = states?.find(state => state.alpha2 === document.state);

    const formattedIssuingDate = format(new Date(document.issuingDate), 'yyyy-MM-dd');
    const formattedExpiryDate = format(new Date(document.expiryDate), 'yyyy-MM-dd');

    return (
        <>
            <div className={cn('title')}>{document.name}</div>
            <div className={cn('content')}>
                <div className={cn('column')}>
                    <div className={cn('key')}>{t('document-number')}</div>
                    <div className={cn('value')}>{document.number}</div>
                </div>
                <div className={cn('column')}>
                    <div className={cn('key')}>{t('issuing-date')}</div>
                    <div className={cn('value')}>{formattedIssuingDate}</div>
                </div>
                <div className={cn('column')}>
                    <div className={cn('key')}>{t('expiry-date')}</div>
                    <div className={cn('value')}>{formattedExpiryDate}</div>
                </div>
                <div className={cn('column')}>
                    <div className={cn('key')}>{t('issuing-country-state')}</div>
                    <div className={cn('value')}>
                        {country?.title}, {state?.title}
                    </div>
                </div>
            </div>
            <div className={cn('description')}>{document.description}</div>
        </>
    );
};
