import React from 'react';
import { Field, FieldRenderProps } from 'react-final-form';

import { NativeSwitch, NativeSwitchProps } from '@/fields/switch-input/native-switch';
import { FormControl } from '@fields';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('admin:accounting:carrier-accounting-drawer');

export const EnablePaymentSystemSwitch = () => (
    <FormControl>
        <Field
            render={(props: FieldRenderProps<boolean> & NativeSwitchProps) => {
                return <NativeSwitch checked={props.input.value} onChange={event => props.input.onChange(event)} {...props} />;
            }}
            name='enablePaymentSystem'
            label={t('enable-payment-system')}
        />
    </FormControl>
);
