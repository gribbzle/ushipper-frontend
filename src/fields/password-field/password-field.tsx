import React, { useCallback, useMemo, useState } from 'react';
import { Field } from 'react-final-form';

import { TextField } from '@/fields/text-field/text-field';
import { classname } from '@utils/classname';

import './password-field.scss';
import EyeClosedIcon from '@/assets/icons/eye-closed.svg';
import EyeIcon from '@/assets/icons/eye.svg';

export type PasswordFieldProps = {
    name: string;
    placeholder?: string;
    label?: string;
    disabled?: boolean;
    error?: string;
    autoComplete?: 'new-password' | 'current-password';
    validate?: (value: string) => string | null | undefined;
};

const cn = classname('password-field');

export const PasswordField = ({ validate, ...props }: PasswordFieldProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(!showPassword);
    }, [showPassword]);

    const passwordVisibilityToggleIcon = useMemo(
        () => (
            <div className={cn('end-adornment')} onClick={togglePasswordVisibility}>
                {showPassword ? <EyeIcon /> : <EyeClosedIcon />}
            </div>
        ),
        [showPassword, togglePasswordVisibility],
    );

    return (
        <Field
            className={cn()}
            type={showPassword ? 'text' : 'password'}
            component={TextField}
            {...props}
            validate={validate}
            required={true}
            endAdornment={passwordVisibilityToggleIcon}
        />
    );
};
