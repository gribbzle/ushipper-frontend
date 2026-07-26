import { MaskProps } from '@react-input/mask';
import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { TextField } from '@fields';
const MASK_VALUE = 'XXXXXXXXX';

export const RoutingNumberInput = (props: FieldRenderProps<string>) => {
    const mask = useMemo<MaskProps>(() => ({ mask: MASK_VALUE, replacement: { X: /[0-9]/ } }), []);

    return <TextField {...props} mask={mask} placeholder={MASK_VALUE} />;
};
