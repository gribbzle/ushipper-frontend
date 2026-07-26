import { useAppSelector } from '@store';
import { useGetUsersQuery, useGetUsersWithCursorPaginationQuery } from '@store/api/users-api';
import { assignDrawerSelector } from '@store/common';

import { AssignUserListProps } from './assign-user-list.types';

export const useAssignUserList = ({ searchName, cursor }: Omit<AssignUserListProps, 'onChangeCursor'>) => {
    const { superiorUserPublicId } = useAppSelector(assignDrawerSelector);

    const { data: users } = useGetUsersWithCursorPaginationQuery({ name: searchName, subordinationPossibleForUserId: String(superiorUserPublicId), cursor });
    const { data: assignedUsers } = useGetUsersQuery({ superiorUserPublicId: String(superiorUserPublicId), perPage: 100 });

    return {
        nextCursor: users?.nextCursor,
        users: users?.data.filter(user => user.publicId !== superiorUserPublicId),
        assignedUsersIds: assignedUsers?.data.map(user => user.publicId),
    };
};
