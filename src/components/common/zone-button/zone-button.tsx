import React from 'react';

import { PlusIcon } from '@icons';
import { classname } from '@utils/classname';

import './zone-button.scss';

const cn = classname('zone-button');

type Props = {
    onClick: () => void;
    label: string;
    Icon?: React.FC<React.SVGProps<SVGSVGElement>>;
    hint?: string;
    className?: string;
    disabled?: boolean;
};

export const ZoneButton = ({ label, onClick, Icon = PlusIcon, hint, className, disabled = false }: Props) => (
    <div className={cn('', { disabled }, [className, 'no-print'])} onClick={disabled ? undefined : onClick}>
        <span className={cn('title')}>
            {!disabled && <Icon />} {label}
        </span>
        {hint && <span className={cn('hint')}>{hint}</span>}
    </div>
);
