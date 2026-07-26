import React, { ReactNode } from 'react';

import { classname } from '@utils';

import { Loader } from '../loader';

import './button.scss';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    className?: string;
    view?: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'link' | 'plain-primary' | 'segmented' | 'primary-green';
    size?: 'default' | 'medium' | 'small' | 'mini';
    plain?: boolean;
    badgeText?: string;
    active?: boolean;
    hasLoader?: boolean;
};

const cn = classname('button');

export const Button = (props: ButtonProps) => {
    const { children, className, view, size, plain, active, badgeText, hasLoader, ...rest } = props;

    return (
        <button
            type='button'
            {...rest}
            className={cn(
                '',
                {
                    view: view || 'default',
                    size: size || 'default',
                    plain,
                    active,
                },
                [className],
            )}
        >
            {hasLoader && <Loader />}
            {children}
            {badgeText && <div className={cn('badge')}>{badgeText}</div>}
        </button>
    );
};
