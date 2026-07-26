import React from 'react';
import { FieldRenderProps } from 'react-final-form';

import { AccountStatusesEnum } from '@/enums';
import { SelectField } from '@fields';
import { getAccountStatusTranslate } from '@utils';

export const AccountStatusesSelect = (props: FieldRenderProps<string>) => {
    const options = Object.values(AccountStatusesEnum).map(status => ({
        label: getAccountStatusTranslate(status),
        value: status,
    }));

    return <SelectField {...props} options={options} />;
};
