import React from 'react';
import { FieldRenderProps } from 'react-final-form';

import { AccountStatusesEnum } from '@/enums';
import {SelectField} from '@/fields/select-field';
import { getAccountStatusTranslate } from '@utils/translate/get-account-status-translate';

export const AccountStatusesSelect = (props: FieldRenderProps<string>) => {
    const options = Object.values(AccountStatusesEnum).map(status => ({
        label: getAccountStatusTranslate(status),
        value: status,
    }));

    return <SelectField {...props} options={options} />;
};
