import { useCallback, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@store';
import { assignDrawerSelector } from '@store/common';
import { staffActions } from '@store/common/staff/slice';

export const useAssignUserDrawer = () => {
    const [searchName, setSearchName] = useState<string>();
    const [cursor, setCursor] = useState<string>();

    const { roleName, userName, isVisible } = useAppSelector(assignDrawerSelector);
    const dispatch = useAppDispatch();

    const handleClose = useCallback(async () => {
        setSearchName(undefined);
        setCursor('');
        dispatch(staffActions.closeAssignDrawer());
    }, [dispatch]);

    const handleSearchChange = useCallback((value: string) => {
        setCursor('');
        setSearchName(value);
    }, []);

    return { userName, roleName, isVisible, searchName, cursor, setCursor, handleClose, handleSearchChange };
};
