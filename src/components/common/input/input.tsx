import React, { forwardRef, InputHTMLAttributes, useCallback, useId, useState } from 'react';

import { classname } from '@utils/classname';

import './input.scss';

const cn = classname('input-wrapper');

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
    warning?: boolean;
    inputSize?: 'default' | 'medium';
    className?: string;
    view?: 'primary' | 'secondary';
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, startAdornment, endAdornment, onBlur, onFocus, warning, inputSize = 'default', view = 'primary', ...rest }, ref) => {
        const id = useId();
        const [focused, setFocused] = useState(false);

        const handleFocus = useCallback(
            (e: React.FocusEvent<HTMLInputElement>) => {
                onFocus?.(e);
                setFocused(true);
            },
            [onFocus],
        );

        const handleBlur = useCallback(
            (e: React.FocusEvent<HTMLInputElement>) => {
                onBlur?.(e);
                setFocused(false);
            },
            [onBlur],
        );

        return (
            <div className={cn()}>
                <label
                    htmlFor={id}
                    className={cn(
                        'input',
                        {
                            disabled: rest.disabled,
                            focused,
                            'with-adornment': !!startAdornment,
                            'with-suffix': !!endAdornment,
                            warning,
                            'input-size': inputSize,
                            view,
                        },
                        [className],
                    )}
                >
                    {startAdornment && <div className={cn('input-adornment')}>{startAdornment}</div>}
                    <input {...rest} className={cn('input-control')} id={id} onFocus={handleFocus} onBlur={handleBlur} ref={ref} />
                    {endAdornment && <div className={cn('input-suffix')}>{endAdornment}</div>}
                </label>
            </div>
        );
    },
);

Input.displayName = 'Input';
