import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { PerformTransactionEventEnum } from '@/enums';
import {SelectField} from '@/fields/select-field';
import { getPerformTransactionEventTranslate } from '@utils/translate/preferences/get-perform-transaction-event-translate';

export const PerformTransactionEventsSelect = ({ ...props }: FieldRenderProps<string>) => {
    const options = useMemo(
        () =>
            Object.values(PerformTransactionEventEnum).map(event => ({
                label: getPerformTransactionEventTranslate(event),
                value: event,
            })),
        [],
    );

    return <SelectField {...props} options={options} />;
};
