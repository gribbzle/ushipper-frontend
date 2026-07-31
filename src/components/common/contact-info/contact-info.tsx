import React, { useMemo } from 'react';
import has from 'has-values';

import { PersonIcon } from '@icons';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { getObjectWithoutEmptyFields } from '@utils/objects';

import './contact-info.scss';

const t = translateByNamespace('common:contact-information');
const cn = classname('contact-information');

type Props = {
    information: {
        fullName?: string | null;
        name?: string | null;
        phone: string | null;
        email: string | null;
    };
};

export const ContactInfo = ({ information }: Props) => {
    const fullName = 'fullName' in information ? information.fullName : information.name;
    const { phone, email } = information;

    const info = useMemo(
        () =>
            getObjectWithoutEmptyFields({
                fullName,
                phone,
                email,
            }),
        [email, fullName, phone],
    );

    if (!has(info)) {
        return null;
    }

    return (
        <div className={cn()}>
            <div className={cn('icon')}>
                <PersonIcon />
            </div>
            <div className={cn('values')}>
                {fullName && <div className={cn('value')}>{fullName}</div>}
                {phone && (
                    <div className={cn('value')}>
                        {t('phone')} <a href={`tel:${phone}`}>{phone}</a>
                    </div>
                )}
                {email && (
                    <div className={cn('value')}>
                        {t('email')} <a href={`mailto:${email}`}>{email}</a>
                    </div>
                )}
            </div>
        </div>
    );
};
