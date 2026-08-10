import React, { useCallback, useMemo, useState } from 'react';
import { debounce } from 'debounce';
import { Field, FieldRenderProps, useForm } from 'react-final-form';

import {TextField} from '@/fields/text-field';
import { CheckVinResponse, useVerifyVinMutation } from '@store/api/vin-api';
import { OrderFieldsGroup } from '@store/client';

type Props = FieldRenderProps<string> & {
    prefixed?: boolean;
    disabled?: boolean;
};

export const VehicleVinInput = ({ input, prefixed = false, disabled = false, ...rest }: Props) => {
    const [verifyVin, { isLoading }] = useVerifyVinMutation();

    const [error, setError] = useState();
    const { batch, change } = useForm();

    const validateVin = useCallback(() => {
        if (error) {
            return error;
        }

        return undefined;
    }, [error]);

    const prefix = useMemo<string>(() => {
        if (prefixed) {
            const index = parseInt(input.name.replace(/^\D+/g, ''));

            return `${OrderFieldsGroup.VEHICLES}[${index}].`;
        }

        return '';
    }, [input.name, prefixed]);

    const formChange = useCallback(
        ({ maker, model, year }: CheckVinResponse) => {
            batch(() => {
                change(prefix + 'make', maker.name);
                change(prefix + 'model', model.name);
                change(prefix + 'year', year);
            });
        },
        [batch, change, prefix],
    );

    const handleChange = useMemo(
        () => (value: string) => {
            if (!value) {
                setError(undefined);

                return;
            }

            verifyVin(value)
                .unwrap()
                .then(result => {
                    setError(undefined);
                    formChange(result);
                })
                .catch(e => setError(e.data.message));
        },
        [formChange, verifyVin],
    );

    const debouncedHandleChange = useMemo(() => debounce((value: string | number) => handleChange(value as string), 300), [handleChange]);

    return (
        <Field name={input.name} validate={validateVin}>
            {({ input }) => (
                <TextField input={input} disabled={disabled} error={error} maxLength={17} isLoading={isLoading} {...rest} callback={debouncedHandleChange} />
            )}
        </Field>
    );
};
