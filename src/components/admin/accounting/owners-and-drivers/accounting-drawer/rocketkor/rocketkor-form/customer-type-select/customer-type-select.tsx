import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { SelectField } from '@fields';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:rocketkor');

export const CustomerTypeSelect = (props: FieldRenderProps<string>) => {
    const options = useMemo(
        () => [
            { label: t('business-type-label'), value: 'business' },
            { label: t('individual-type-label'), value: 'individual' },
        ],
        [],
    );

    return <SelectField {...props} options={options} />;
};
