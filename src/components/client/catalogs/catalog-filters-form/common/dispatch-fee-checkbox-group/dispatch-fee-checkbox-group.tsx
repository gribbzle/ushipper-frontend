import React from 'react';
import { Field } from 'react-final-form';

import {LabeledCheckboxInput} from '@/fields/checkbox-input';

import { useDispatchFeeCheckBoxGroup } from './use-dispatch-fee-checkbox-group';

export const DispatchFeeCheckBoxGroup = () => {
    const { handleCheckboxChange, selectedValues, dispatchFeeCheckboxes } = useDispatchFeeCheckBoxGroup();

    return (
        <>
            {dispatchFeeCheckboxes.map(option => (
                <Field
                    name={`dispatchFee-${option.value}`}
                    key={option.value}
                    render={({ input }) => (
                        <LabeledCheckboxInput
                            label={option.label}
                            input={{
                                ...input,
                                value: selectedValues.includes(option.value),
                                checked: selectedValues.includes(option.value),
                                onChange: () => handleCheckboxChange(option.value),
                            }}
                            meta={{}}
                        />
                    )}
                />
            ))}
        </>
    );
};
