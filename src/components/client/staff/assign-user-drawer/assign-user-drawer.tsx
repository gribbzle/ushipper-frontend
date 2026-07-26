import React from 'react';

import { Drawer } from '@/components/common';
import { classname, renderTextWithBreakLines, translateByNamespace } from '@utils';

import { AssignUserList } from './assign-user-list/assign-user-list';
import { AssignUserSearch } from './assign-user-search/assign-user-search';
import { useAssignUserDrawer } from './use-assign-user-drawer';

import './assign-user-drawer.scss';

const t = translateByNamespace('common:staff-table');
const cn = classname('assign-user-drawer');

export const AssignUserDrawer = () => {
    const { userName, roleName, isVisible, searchName, handleSearchChange, handleClose, cursor, setCursor } = useAssignUserDrawer();

    return (
        <Drawer
            bodyClassName={cn('')}
            body={<AssignUserList searchName={searchName} cursor={cursor} onChangeCursor={setCursor} />}
            head={renderTextWithBreakLines(t('assign-to', { userName: userName ?? '', roleName: String(roleName) }))}
            subhead={<AssignUserSearch onChange={handleSearchChange} initValue={searchName} />}
            isOpen={isVisible}
            onClose={handleClose}
            size='small'
        />
    );
};
