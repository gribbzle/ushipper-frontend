import { MaskProps } from '@react-input/mask';
import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import {TextField} from '@/fields/text-field';
const MASK_VALUE = 'YYYY-MM-DD';

export const DateOfBirthInput = (props: FieldRenderProps<string>) => {
    const mask = useMemo<MaskProps>(() => ({ mask: MASK_VALUE, replacement: { Y: /\d/, M: /\d/, D: /\d/ } }), []);

    return <TextField {...props} mask={mask} placeholder={MASK_VALUE} />;
};
