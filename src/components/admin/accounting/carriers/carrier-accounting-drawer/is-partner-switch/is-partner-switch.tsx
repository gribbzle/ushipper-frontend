import React from 'react';
import { Field, FieldRenderProps } from 'react-final-form';

import { NativeSwitch, NativeSwitchProps } from '@/fields/switch-input/native-switch';
import { FormControl } from '@fields';
import { translateByNamespace } from '@utils/i18n';

import { useIsPartnerSwitch } from './use-is-partner-switch';

const t = translateByNamespace('admin:accounting:carrier-accounting-drawer');

export const IsPartnerSwitch = () => {
    const { handleIsPartnerSwitchChange } = useIsPartnerSwitch();

    return (
        <FormControl>
            <Field
                render={(props: FieldRenderProps<boolean> & NativeSwitchProps) => {
                    return (
                        <NativeSwitch
                            checked={props.input.value}
                            onChange={event => {
                                props.input.onChange(event);

                                handleIsPartnerSwitchChange(event);
                            }}
                            {...props}
                        />
                    );
                }}
                name='isPartner'
                label={t('ushipper-partner')}
            />
        </FormControl>
    );
};
