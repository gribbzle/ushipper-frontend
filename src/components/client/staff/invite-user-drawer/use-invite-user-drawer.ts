import { useCallback, useMemo, useRef, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { FormApi } from 'final-form';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { useAppSelector } from '@store';
import { useInviteUserMutation } from '@store/api/invite-api';
import { useGetUsersQuery } from '@store/api/users-api';
import { userRolesSelector } from '@store/client';
import { translateByNamespace } from '@utils/i18n';

import { InviteUserFormData } from './invite-user-drawer.types';

const t = translateByNamespace('client:staff-page');

export const useInviteUserDrawer = () => {
    const [selectedRoleId, setSelectedRoleId] = useState<number | undefined>(undefined);

    const userRoles = useAppSelector(userRolesSelector);

    const rolesOptions = useMemo(
        () => userRoles?.filter(role => role.isRoleAvailableInSelect).map(({ id, name }) => ({ value: id, label: name })),
        [userRoles],
    );

    const router = useRouter();
    const isOpened = !!router.query.isInviteUserDrawerOpened;
    const [inviteUser] = useInviteUserMutation();

    const formRef = useRef<FormApi<InviteUserFormData>>();

    const handleOnChangeRole = useCallback((id: number) => {
        setSelectedRoleId(id);

        return id;
    }, []);

    const { data: superiorUsers } = useGetUsersQuery({ superiorsForRoleId: selectedRoleId });

    const superiorUsersOptions = useMemo(() => superiorUsers?.data.map(({ publicId, name }) => ({ value: publicId, label: name })), [superiorUsers]);

    const handleClose = useCallback(async () => {
        const newQuery = {
            ...router.query,
            isInviteUserDrawerOpened: null,
        };

        await router.push(
            {
                pathname: router.pathname,
                query: newQuery,
            },
            {
                pathname: router.asPath.split('?')[0],
                query: newQuery,
            },
        );
    }, [router]);

    const handleInviteUserClick = useCallback(() => {
        formRef.current?.submit();
    }, []);

    const handleSubmit = useCallback(
        async (values: InviteUserFormData) => {
            try {
                await inviteUser(values).unwrap();

                toast.success(t<string>('invite-drawer.success'));
                handleClose();
            } catch (exception) {
                const {
                    data: { message },
                } = exception as AxiosResponse<AxiosError>;

                toast.error(message);
            }
        },
        [handleClose, inviteUser],
    );

    return {
        formRef,
        isOpened,
        rolesOptions,
        handleClose,
        handleSubmit,
        handleInviteUserClick,
        selectedRoleId,
        superiorUsersOptions,
        handleOnChangeRole,
    };
};
