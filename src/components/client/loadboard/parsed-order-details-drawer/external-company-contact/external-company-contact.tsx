import React from 'react';

import { ExternalCompanyContact } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { DetailItem } from '../detail-item';

import './external-company-contact.scss';

const cn = classname('external-company-contact');
const t = translateByNamespace('client:loadboard:load-details');

export const ExternalCompanyContactInfo = ({ contactInformation }: { contactInformation?: ExternalCompanyContact | null }) => {
    const { preferredContactMethod, mainPhone, localPhone, tollFree, faxNumber } = contactInformation || {};

    return (
        <div className={cn('')}>
            <DetailItem label={t('preferred-contact-method')} value={preferredContactMethod} />
            <DetailItem label={t('main-phone')} value={mainPhone} />
            <DetailItem label={t('local-phone')} value={localPhone} />
            <DetailItem label={t('fax-number')} value={faxNumber} />
            <DetailItem label={t('toll-free')} value={tollFree} />
        </div>
    );
};
