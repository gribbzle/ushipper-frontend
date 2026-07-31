import React, { useCallback, useMemo } from 'react';
import { Field, Form } from 'react-final-form';

import { GenericButton } from '@/components/common/generic-button/generic-button';
import { DarkInput } from '@fields';
import { CloseIcon } from '@icons';
import { classname } from '@utils/classname';

import { CallingKeyboardFormValue, CallingKeyboardProps } from './calling-keyboard.types';

import './calling-keyboard.scss';

const cn = classname('calling-keyboard');

const ALLOWED_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#', 'Backspace'];

export const CallingKeyboard = ({ onClose, onInputKey }: CallingKeyboardProps) => {
    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (ALLOWED_KEYS.includes(event.key)) {
                onInputKey(event.key);
            } else {
                event.preventDefault();
            }
        },
        [onInputKey],
    );

    const handleSubmit = useCallback(() => undefined, []);

    const initialValues = useMemo(
        () => ({
            digits: '',
        }),
        [],
    );

    return (
        <div className={cn('')}>
            <Form<CallingKeyboardFormValue>
                onSubmit={handleSubmit}
                initialValues={initialValues}
                render={({ form, values: { digits } }) => {
                    const handleButtonClick = (digit: string) => {
                        form.change('digits', `${digits}${digit}`);
                        onInputKey(digit);
                    };

                    return (
                        <form>
                            <Field placeholder='' view='blue' onKeyDown={handleKeyDown} name='digits' component={DarkInput} />
                            <div className={cn('buttons')}>
                                {ALLOWED_KEYS.slice(0, -1).map(key => (
                                    <GenericButton key={key} view='blue' onClick={() => handleButtonClick(key)}>
                                        {key}
                                    </GenericButton>
                                ))}
                            </div>
                        </form>
                    );
                }}
            />
            <div className={cn('close')}>
                <GenericButton figure='circle' size='small' view='blue' onClick={onClose}>
                    <CloseIcon />
                </GenericButton>
            </div>
        </div>
    );
};
