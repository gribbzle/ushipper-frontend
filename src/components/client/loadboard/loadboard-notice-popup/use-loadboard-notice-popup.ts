import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '@store';
import { loadboardActions, loadboardNoticePopupSelector } from '@store/client/loadboard';

export const useLoadboardNoticePopup = () => {
    const dispatch = useAppDispatch();

    const { opened, description } = useAppSelector(loadboardNoticePopupSelector);

    const handleCloseLoadboardNoticePopup = useCallback(
        () => dispatch(loadboardActions.setLoadboardNoticePopup({ opened: false, description: null })),
        [dispatch],
    );

    return { handleCloseLoadboardNoticePopup, opened, description };
};
