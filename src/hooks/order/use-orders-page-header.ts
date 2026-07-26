import { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { useAppSelector } from '@store';
import { useParseOrderFileMutation } from '@store/api/orders-api';
import { isCreateOrderFromFileLoadingSelector, ordersActions } from '@store/client';

export const useOrdersPageHeader = () => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [parseOrderFile] = useParseOrderFileMutation();
    const isLoading = useAppSelector(isCreateOrderFromFileLoadingSelector);
    const dispatch = useDispatch();

    const onOrderFileUpload = useCallback(
        (file: File) => {
            parseOrderFile(file);
            dispatch(ordersActions.setIsCreateOrderFromFileLoading(true));
        },
        [dispatch, parseOrderFile],
    );

    return { inputRef, isLoading, onOrderFileUpload };
};
