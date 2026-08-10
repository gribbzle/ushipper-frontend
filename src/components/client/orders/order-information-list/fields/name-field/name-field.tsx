import React from 'react';

import { IconButton } from '@/components/common/icon-button/icon-button';
import { useCanManageOrder } from '@/hooks/order';
import { classname } from '@utils/classname';

import './name-field.scss';
import PencilIcon from '@/assets/icons/pencil.svg';

const cn = classname('name-field');

type NameFieldProps = {
    title: string | null;
    emptyLabel?: string;
    onClick: () => void;
};

export const NameField = ({ title, emptyLabel, onClick }: NameFieldProps) => {
    const canPerformActions = useCanManageOrder();

    return (
        <div className={cn('')}>
            <span>{title ?? emptyLabel}</span>
            {canPerformActions && <IconButton Icon={PencilIcon} size='mini' onClick={onClick} />}
        </div>
    );
};
