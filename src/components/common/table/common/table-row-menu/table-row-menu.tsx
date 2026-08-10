import React from 'react';

import { DropdownDividerOption, DropdownOption } from '@/components/common/dropdown/dropdown';
import { FloatingDropdown } from '@/components/common/dropdown/floating-dropdown';
import { classname } from '@utils/classname';

import './table-row-menu.scss';
import ActionsIcon from '@/assets/icons/actions-icon.svg';

type TableRowMenuProps = {
    dataTestId: string;
    options: Array<DropdownOption | DropdownDividerOption>;
    className?: string;
};

const cn = classname('table-row-menu');

export const TableRowMenu = ({ options, dataTestId, className }: TableRowMenuProps) => (
    <FloatingDropdown dataTestId={dataTestId} options={options} className={cn('', [className])}>
        <ActionsIcon className={cn('icon')} />
    </FloatingDropdown>
);
