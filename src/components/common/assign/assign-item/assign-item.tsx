import React, { ReactNode } from 'react';

import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { Button } from '../../button';

import './assign-item.scss';

const t = translateByNamespace('common:assign-item');
const cn = classname('assign-item');

type Props = {
    className?: string;
    children: ReactNode;
    onClick: () => void;
    disabled?: boolean;
    buttonLabel?: string;
};

export const AssignItem = ({ children, className, disabled = false, onClick, buttonLabel }: Props) => (
    <div className={cn('', { disabled }, [className])} onClick={onClick}>
        <div className={cn('content')}>{children}</div>
        {!disabled && (
            <Button size='medium' className={cn('assign-btn')}>
                {buttonLabel || t('btn-label')}
            </Button>
        )}
    </div>
);
