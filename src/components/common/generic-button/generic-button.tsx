import React from 'react';

import { classname } from '@utils';

import './generic-button.scss';

type GenericButtonProps = {
    view?: 'gray' | 'accent' | 'danger' | 'blue' | 'white' | 'green' | 'primary';
    size?: 'medium' | 'small' | 'large';
    figure?: 'square' | 'circle';
    disabled?: boolean;
    children: JSX.Element | string;
    type?: 'submit' | 'button';
    onClick?: (e?: React.MouseEvent) => void;
};

const cn = classname('generic-button');

export const GenericButton = ({ size = 'medium', view = 'gray', figure = 'square', type = 'button', disabled, children, onClick }: GenericButtonProps) => (
    <button type={type} onClick={onClick} disabled={disabled} className={cn('', { [size]: true, [view]: true, [figure]: true })}>
        {children}
    </button>
);
