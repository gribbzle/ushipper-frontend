import React from 'react';
import { FieldRenderProps } from 'react-final-form';

import { SelectField } from '@fields';

import { useLegalEntityTypes } from '../../use-legal-entity-types';

export const TypeOfBusinessSelect = (props: FieldRenderProps<string>) => {
    const options = useLegalEntityTypes();

    return <SelectField {...props} options={options} displayAllOptions={true} />;
};
