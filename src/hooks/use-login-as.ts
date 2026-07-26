import { useCallback, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

import { useRouterForAccountChange } from '@hooks';
import { useAppDispatch } from '@store';
import { changeAccountSubmit } from '@store/client';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('common:sidebar.notification');

export const useLoginAs = () => {
    const dispatch = useAppDispatch();

    const { redirectToStartPage } = useRouterForAccountChange();
    const redirectToStartPageRef = useRef(redirectToStartPage);

    const handleLoginAs = useCallback(
        ({ isNewAccountDispatcher, userPublicId }: { isNewAccountDispatcher: boolean; userPublicId: string }) => {
            dispatch(changeAccountSubmit({ publicId: userPublicId, isAdmin: true }))
                .unwrap()
                .then(() => {
                    redirectToStartPageRef.current(isNewAccountDispatcher);

                    toast.success(t<string>('account-change-success'));
                })
                .catch(() => {
                    toast.error(t<string>('account-change-error'));
                });
        },
        [dispatch, redirectToStartPageRef],
    );

    useEffect(() => {
        redirectToStartPageRef.current = redirectToStartPage;
    }, [redirectToStartPage]);

    return handleLoginAs;
};
