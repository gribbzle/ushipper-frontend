import React from 'react';
import { FieldRenderProps } from 'react-final-form';

import { FormControl, NativeSwitch, NativeSwitchProps, PrefixedField } from '@fields';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('admin:accounting:carrier-accounting-drawer:factoring');

export const AutoSendFactoringRequestSwitch = () => (
    <FormControl>
        <PrefixedField
            render={(props: FieldRenderProps<boolean> & NativeSwitchProps) => {
                return <NativeSwitch checked={props.input.value} onChange={event => props.input.onChange(event)} {...props} />;
            }}
            name='autoSendFactoringRequest'
            label={t('auto-send-factoring-request')}
        />
    </FormControl>
);
