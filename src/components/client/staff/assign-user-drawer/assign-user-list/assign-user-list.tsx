import React from 'react';

import { User } from '@store/common';
import { List } from '@ui';
import { classname } from '@utils/classname';

import { AssignUserItem } from '../assign-user-item/assign-user-item';

import { AssignUserListProps } from './assign-user-list.types';
import { useAssignUserList } from './use-assign-user-list';

import './assign-user-list.scss';

const cn = classname('assign-user-list');

export const AssignUserList = ({ searchName, cursor, onChangeCursor }: AssignUserListProps) => {
    const { users, assignedUsersIds, nextCursor } = useAssignUserList({ searchName, cursor });

    return (
        <List<User>
            className={cn('')}
            data={users}
            onEndReached={() => {
                if (nextCursor) {
                    onChangeCursor(nextCursor);
                }
            }}
            renderItem={({ item }) => <AssignUserItem assigned={assignedUsersIds?.includes(item.publicId)} user={item} key={item.publicId} />}
        />
    );
};
