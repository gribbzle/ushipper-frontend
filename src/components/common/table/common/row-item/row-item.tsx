import React, { ReactNode } from 'react';

import { classname } from '@utils';

import './row-item.scss';

const cn = classname('row-item');

type RowItemProps = {
    label?: string;
    value: ReactNode;
    onClick?: (event: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => void;
    isHover?: boolean;
    valueClassName?: string;
};

export const RowItem = ({ label, value, isHover = false, onClick, valueClassName }: RowItemProps) => (
    <div className={cn('')}>
        {label && <p className={cn('label')}>{label}:</p>}
        <p
            className={cn('value', { hover: isHover }, [valueClassName])}
            onClick={event => {
                if (onClick) {
                    event.stopPropagation();
                    onClick(event);
                }
            }}
        >
            {value}
        </p>
    </div>
);
