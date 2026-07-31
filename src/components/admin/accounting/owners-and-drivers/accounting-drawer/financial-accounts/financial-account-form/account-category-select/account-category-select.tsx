import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { SelectField } from '@fields';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:financial-accounts:form');

export const AccountCategorySelect = (props: FieldRenderProps<string>) => {
    const options = useMemo(() => [{ label: t('external-type-label'), value: 'external' }], []);

    return <SelectField {...props} options={options} />;
};
