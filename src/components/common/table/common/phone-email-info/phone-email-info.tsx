import React from 'react';
import { formatPhoneNumberIntl } from 'react-phone-number-input';

import { TickIcon, XCircleIcon } from '@icons';
import { classname } from '@utils';

import './phone-email-info.scss';

const cn = classname('phone-email-info');

type Props = {
    phone: string | null;
    email: string;
    phoneVerifiedAt?: string | null;
    emailVerifiedAt?: string | null;
    showVerifiedInfo?: boolean;
    trimValue?: boolean;
};

const getFormattedPhoneNumber = (phone: string) => {
    if (phone.startsWith('+')) {
        return formatPhoneNumberIntl(phone);
    }

    const digitsOnly = phone.replace(/\D/g, '');
    const usFormattedNumber = `+1${digitsOnly}`;

    return formatPhoneNumberIntl(usFormattedNumber);
};

const VerifiedInfo = ({ checked }: { checked: boolean }) => (
    <span className={cn('icon')}>{checked ? <TickIcon className={cn('icon-success')} /> : <XCircleIcon className={cn('icon-danger')} />}</span>
);

export const PhoneEmailInfo = ({ phone, email, phoneVerifiedAt, emailVerifiedAt, showVerifiedInfo = false, trimValue = false }: Props) => (
    <div className={cn()}>
        {phone && (
            <div className={cn('row', { trimmed: trimValue })}>
                <span className={cn('value', { trimmed: trimValue })}>{getFormattedPhoneNumber(phone)}</span>
                {showVerifiedInfo && <VerifiedInfo checked={!!phoneVerifiedAt} />}
            </div>
        )}
        <div className={cn('row', { trimmed: trimValue })}>
            <span className={cn('value', { trimmed: trimValue })}>{email}</span>
            {showVerifiedInfo && <VerifiedInfo checked={!!emailVerifiedAt} />}
        </div>
    </div>
);
