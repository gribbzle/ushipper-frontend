import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { InstantTermPaymentType } from '@/enums/instant-term-payment-type';
import {SelectField} from '@/fields/select-field';
import { useMeAdmin } from '@/hooks/use-user-role-group';
import { getDriverPaymentRecipientTranslate, getPaymentRecipientTranslate } from '@utils/translate/get-payment-recipient-translate';

export const DriverInstantTermPaymentTypeSelect = (props: FieldRenderProps<string>) => {
    const isMeAdmin = useMeAdmin();

    const options = useMemo(
        () => [
            {
                label: isMeAdmin
                    ? getPaymentRecipientTranslate(InstantTermPaymentType.RECIPIENT_DRIVER)
                    : getDriverPaymentRecipientTranslate(InstantTermPaymentType.RECIPIENT_DRIVER),
                value: InstantTermPaymentType.RECIPIENT_DRIVER,
            },
            { label: getDriverPaymentRecipientTranslate(InstantTermPaymentType.RECIPIENT_COMPANY), value: InstantTermPaymentType.RECIPIENT_COMPANY },
        ],
        [isMeAdmin],
    );

    return <SelectField options={options} {...props} />;
};
