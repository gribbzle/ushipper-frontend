import { useCallback, useState } from 'react';

import { useGetUsersWithCursorPaginationQuery } from '@store/api/users-api';
import { User } from '@store/common';

export const useGetUsersWithCursorPagination = (user: User, skip: boolean) => {
    const [cursor, setCursor] = useState<string | undefined>('');

    const { data: usersData = [], nextCursor = undefined } =
        useGetUsersWithCursorPaginationQuery(
            {
                superiorUserPublicId: user.publicId,
                perPage: 20,
                cursor,
            },
            { skip },
        ).data || {};

    const handleShowMoreUsers = useCallback(() => {
        setCursor(nextCursor || undefined);
    }, [nextCursor]);

    return { usersData, nextCursor, setCursor, handleShowMoreUsers };
};
