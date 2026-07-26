import { MaskProps } from '@react-input/mask';
import React from 'react';
import { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { TextField } from '@fields';

export const BusinessTaxIdInput = (props: FieldRenderProps<string>) => {
    const mask = useMemo<MaskProps>(() => ({ mask: 'XX-XXXXXXX', replacement: { X: /\d/ } }), []);

    return <TextField {...props} mask={mask} />;
};
