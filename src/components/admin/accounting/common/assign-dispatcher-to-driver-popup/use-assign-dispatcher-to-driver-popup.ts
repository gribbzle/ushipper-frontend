import { useCallback, useMemo, useRef } from 'react';
import { FormApi } from 'final-form';
import { toast } from 'react-toastify';

import { BackError, processError } from '@/utils/process-error';
import { useInvalidateSelectedAccountTags } from '@hooks';
import { useAppDispatch, useAppSelector } from '@store';
import { accountingActions, assignDispatcherToDriverPopupPropsSelector } from '@store/admin';
import { accountingAccountsApi } from '@store/api/accounting-accounts-api';
import { useUpdateUserJSONMutation } from '@store/api/users-api';
import { translateByNamespace } from '@utils';

import { AssignDispatcherFormState } from './assign-dispatcher-to-driver-popup';

const t = translateByNamespace('admin:accounting:notifications');

export const useAssignDispatcherToDriverPopup = () => {
    const { isPopupOpened, user, reassign } = useAppSelector(assignDispatcherToDriverPopupPropsSelector);
    const formRef = useRef<FormApi<AssignDispatcherFormState>>();
    const [updateUser] = useUpdateUserJSONMutation();

    const dispatch = useAppDispatch();
    const invalidateSelectedAccountTags = useInvalidateSelectedAccountTags();

    const handleSubmitClick = useCallback(() => formRef.current?.submit(), []);

    const handleClosePopup = useCallback(
        () => dispatch(accountingActions.setAssignDispatcherToDriverPopupProps({ isPopupOpened: false, user: null, reassign: false })),
        [dispatch],
    );

    const onSubmit = useCallback(
        async ({ superiorUserPublicId }: AssignDispatcherFormState) => {
            if (user) {
                try {
                    await updateUser({ superiorUserPublicId: String(superiorUserPublicId), publicId: user.publicId }).unwrap();

                    dispatch(accountingAccountsApi.util.invalidateTags([{ type: 'AccountingAccounts', id: 'LIST' }]));
                    invalidateSelectedAccountTags();

                    handleClosePopup();
                    toast.success<string>(t(`${reassign ? 'reassign' : 'assign'}-dispatcher-to-driver-success`));
                } catch (error) {
                    processError(error as BackError);
                }
            }
        },
        [dispatch, updateUser, handleClosePopup, invalidateSelectedAccountTags, user, reassign],
    );

    const initialValues = useMemo<AssignDispatcherFormState>(
        () => (reassign ? { superiorUserPublicId: user?.superiorUser?.publicId } : {}),
        [reassign, user?.superiorUser?.publicId],
    );

    return {
        formRef,
        isPopupOpened,
        user,
        reassign,
        initialValues,
        onSubmit,
        handleSubmitClick,
        handleClosePopup,
    };
};
