import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AxiosError } from 'axios';
import { FormApi } from 'final-form';
import { useSelector } from 'react-redux';

import parseValidationFields from '@/utils/parse-validation-fields';
import { useEffectOnce, useIsPartnerCompany, useMeAdmin, useMeOwner } from '@hooks';
import { useAppDispatch, useAppSelector } from '@store';
import { createEditUserFormSubmit, createEditUserModalModeSelector, fetchedUserSelector, fetchUserRolesAction, userRolesSelector } from '@store/client';
import { staffActions } from '@store/common/staff/slice';
import { translateByNamespace } from '@utils';

import { CreateEditFormState, CreateEditStaffDrawerProps } from './create-edit-staff-drawer.types';

const t = translateByNamespace('common:create-edit-user-drawer');

export const useCreateEditStaffDrawer = ({ isOpen, pageId, onClose }: CreateEditStaffDrawerProps) => {
    const isMeOwner = useMeOwner();
    const isMeAdmin = useMeAdmin();
    const dispatch = useAppDispatch();
    const formRef = useRef<FormApi<CreateEditFormState>>();
    const [newPasswordError, setNewPasswordError] = useState<string | undefined>(undefined);

    const onSubmit = useCallback(
        async (values: CreateEditFormState) => {
            const { role, isActive, twilioPhone, trailerCapacity, telegramId, ...other } = values;

            const res = await dispatch(
                createEditUserFormSubmit({
                    ...other,
                    trailerCapacity: trailerCapacity ?? '',
                    twilioPhone: twilioPhone ?? '',
                    telegramId: telegramId ?? '',
                    isActive: isActive ? 1 : 0,
                    roleId: role,
                }),
            );

            if (res.payload instanceof AxiosError) {
                const axiosError = res.payload as AxiosError;

                if (axiosError.response?.status === 400) {
                    const data: { message?: string } = axiosError.response?.data || {};

                    setNewPasswordError(data.message);
                }
            }

            return parseValidationFields(res.payload);
        },
        [dispatch],
    );

    const onSubmitHandler = useCallback(() => formRef.current?.submit(), []);

    const createEditUserModalMode = useSelector(createEditUserModalModeSelector);
    const fetchedUser = useSelector(fetchedUserSelector);

    useEffectOnce(() => {
        if (pageId === 'administrators') {
            dispatch(fetchUserRolesAction());
        }
    });

    useEffect(() => {
        if (fetchedUser && fetchedUser.roleGroup !== 'administrators' && pageId !== 'administrators') {
            dispatch(fetchUserRolesAction(fetchedUser.companyPublicId));
        }
    }, [dispatch, fetchedUser, pageId]);

    const userRoles = useAppSelector(userRolesSelector);

    const userRolesOptions = useMemo(
        () => userRoles?.filter(role => role.id === fetchedUser?.roleId || role.isRoleAvailableInSelect).map(({ id, name }) => ({ value: id, label: name })),
        [userRoles, fetchedUser],
    );

    const initialValues = useMemo(() => {
        if (!fetchedUser || createEditUserModalMode === 'create') {
            return {};
        }

        const { roleId, status, ...others } = fetchedUser;

        return {
            ...others,
            isActive: status === 'active',
            role: userRolesOptions?.find(({ value }) => value === roleId)?.value,
        };
    }, [createEditUserModalMode, fetchedUser, userRolesOptions]);

    const onDeleteClickHandler = useCallback(() => {
        if (fetchedUser) {
            dispatch(staffActions.setDeleteUserPopupProps({ isVisible: true, userId: fetchedUser.publicId as string, userName: fetchedUser.name }));
        }
    }, [dispatch, fetchedUser]);

    const isNotVisible = !isOpen || (createEditUserModalMode === 'edit' && !fetchedUser);
    const isAdministratorsPage = pageId === 'administrators';
    const isUsersPage = pageId === 'users';
    const disableFields = useMemo(() => !isMeOwner && fetchedUser?.roleType.includes('owner') && !isMeAdmin, [isMeOwner, isMeAdmin, fetchedUser?.roleType]);
    const disableUserRoleField = useMemo(
        () => createEditUserModalMode === 'edit' && fetchedUser && fetchedUser.roleType.includes('_owner'),
        [createEditUserModalMode, fetchedUser],
    );

    const headText = useMemo(() => {
        if (createEditUserModalMode !== 'create') {
            return fetchedUser?.name;
        }

        return isAdministratorsPage ? t('new-admin-button') : t('new-user-button');
    }, [createEditUserModalMode, fetchedUser, isAdministratorsPage]);

    const isUserCompanyPartner = useIsPartnerCompany();
    const [selectedRole, setSelectedRole] = useState<string | undefined>();

    useEffect(() => {
        if (fetchedUser?.roleId) {
            setSelectedRole(fetchedUser?.roleId.toString());
        }
    }, [fetchedUser]);

    const selectedRoleType = useMemo(() => {
        if (!selectedRole) {
            return;
        }

        return userRoles?.find(role => role.id === parseInt(selectedRole, 10))?.type;
    }, [userRoles, selectedRole]);

    const onCloseHandler = useCallback(() => {
        onClose();
        setSelectedRole(undefined);
        setNewPasswordError(undefined);
    }, [onClose]);

    const isMultiUserStaffEdit = useMemo(
        () => createEditUserModalMode === 'edit' && pageId === 'staff' && fetchedUser?.isMultiuser,
        [pageId, createEditUserModalMode, fetchedUser],
    );

    return {
        formRef,
        userRolesOptions,
        selectedRoleType,
        isUserCompanyPartner,
        headText,
        disableFields,
        isAdministratorsPage,
        isUsersPage,
        isNotVisible,
        initialValues,
        newPasswordError,
        createEditUserModalMode,
        disableUserRoleField,
        isMultiUserStaffEdit,
        onCloseHandler,
        onSubmitHandler,
        onDeleteClickHandler,
        setSelectedRole,
        onSubmit,
    };
};
