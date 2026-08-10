import { useCallback, useMemo, useRef } from 'react';
import { AxiosError } from 'axios';
import { FormApi } from 'final-form';
import { useSelector } from 'react-redux';

import { CompanyStatusEnum } from '@/enums/company-status-enum';
import { useOpenDeleteCompanyPopup } from '@/hooks/companies/use-open-delete-company-popup';
import { useAppDispatch, useAppSelector } from '@store';
import {
    createCompanyFormSubmit,
    createEditCompanyDrawerModeSelector,
    editCompanyFormSubmit,
    fetchedCompanySelector,
    isCreateEditCompanyDrawerVisibleSelector,
} from '@store/admin';
import { companyApi } from '@store/api/company-api';

import { BackendErrors, CreateEditFormState, FrontendErrors } from './create-edit-company-drawer..types';
import { translateErrors } from './utils';

export const useCreateEditCompanyDrawer = () => {
    const isOpen = useAppSelector(isCreateEditCompanyDrawerVisibleSelector);
    const onOpenDeleteCompanyPopup = useOpenDeleteCompanyPopup();

    const dispatch = useAppDispatch();
    const formRef = useRef<FormApi<CreateEditFormState>>();

    const createEditCompanyDrawerMode = useSelector(createEditCompanyDrawerModeSelector);
    const fetchedCompany = useSelector(fetchedCompanySelector);

    const onSubmit = useCallback(
        async (values: CreateEditFormState) => {
            const { type, isActive, ...other } = values;

            try {
                if (createEditCompanyDrawerMode === 'create') {
                    await dispatch(
                        createCompanyFormSubmit({
                            ...other,
                            ownerEmail: values.email,
                            ownerPhone: values.phone,
                            isActive: isActive ? 1 : 0,
                            type: type,
                        }),
                    ).unwrap();
                }
                if (createEditCompanyDrawerMode === 'edit' && fetchedCompany) {
                    await dispatch(
                        editCompanyFormSubmit({
                            companyId: fetchedCompany?.publicId,
                            data: {
                                twilioPhone: values.twilioPhone ?? '',
                                name: values.name,
                                isActive: isActive ? 1 : 0,
                                email: values.email,
                                phone: values.phone,
                            },
                        }),
                    ).unwrap();
                }

                dispatch(companyApi.util.invalidateTags([{ type: 'Companies', id: 'LIST' }]));
            } catch (err) {
                if (err instanceof AxiosError && err.response?.status === 422) {
                    const backendErrors: BackendErrors = err.response?.data.errors;
                    const frontendErrors: FrontendErrors = {};

                    for (const key in backendErrors) {
                        if (key === 'owner_email') {
                            frontendErrors['email'] = backendErrors[key]?.[0];
                        } else {
                            frontendErrors[key as keyof CreateEditFormState] = backendErrors[key as keyof BackendErrors]?.[0];
                        }
                    }

                    return translateErrors(frontendErrors);
                } else {
                    console.log(err);
                }
            }
        },
        [dispatch, createEditCompanyDrawerMode, fetchedCompany],
    );

    const onSubmitHandler = useCallback(() => formRef.current?.submit(), []);

    const initialValues = useMemo(() => {
        if (!fetchedCompany || createEditCompanyDrawerMode === 'create') {
            return {};
        }

        return {
            ...fetchedCompany,
            isActive: fetchedCompany.status === CompanyStatusEnum.ACTIVE,
        };
    }, [fetchedCompany, createEditCompanyDrawerMode]);

    const onDeleteClickHandler = useCallback(() => {
        if (fetchedCompany) {
            onOpenDeleteCompanyPopup({ companyId: fetchedCompany.publicId as string, companyName: fetchedCompany.name });
        }
    }, [fetchedCompany, onOpenDeleteCompanyPopup]);

    const isNotVisible = !isOpen || (createEditCompanyDrawerMode === 'edit' && !fetchedCompany);

    return {
        isNotVisible,
        onDeleteClickHandler,
        initialValues,
        onSubmitHandler,
        onSubmit,
        createEditCompanyDrawerMode,
        fetchedCompany,
        formRef,
    };
};
