import { useCallback, useMemo, useRef } from 'react';
import { FormApi } from 'final-form';
import { useSelector } from 'react-redux';

import parseValidationFields from '@/utils/parse-validation-fields';
import { useAppDispatch } from '@store';
import {
    CreateEditBlackListItemData,
    createEditBlackListItemFormSubmit,
    createEditBlackListItemModalModeSelector,
    fetchedBlackListItemSelector,
} from '@store/client';
import { blackListActions } from '@store/common/black-list/slice';
import { authorizedUserCompanyPublicIdSelector } from '@store/global';
import { translateByNamespace } from '@utils';

import { useTermsSelectOptions } from '../../terms-select/use-terms-select-options';

import { useRoleTypesSelectOptions } from './black-list-role-types-select';
import { CreateEditFormState } from './create-edit-black-list-item-drawer.types';

const t = translateByNamespace('common:black-list-page:create-edit-drawer');

export const useCreateEditBlackListItemDrawer = ({ isOpen }: { isOpen: boolean }) => {
    const dispatch = useAppDispatch();
    const formRef = useRef<FormApi<CreateEditFormState>>();
    const authorizedUserCompanyPublicId = useSelector(authorizedUserCompanyPublicIdSelector);

    const onSubmit = useCallback(
        async (values: CreateEditFormState) => {
            const preparedValues = { ...values, terms: [], roleTypes: [] } as CreateEditBlackListItemData;

            if (values?.terms) {
                preparedValues.terms = values?.terms?.map(({ value }) => value) ?? [];
            }

            if (values?.roleTypes) {
                preparedValues.roleTypes = values?.roleTypes?.map(({ value }) => value) ?? [];
            }

            if (authorizedUserCompanyPublicId) {
                preparedValues.companyId = authorizedUserCompanyPublicId;
            }

            const res = await dispatch(createEditBlackListItemFormSubmit(preparedValues));

            return parseValidationFields(res.payload);
        },
        [authorizedUserCompanyPublicId, dispatch],
    );

    const onSubmitHandler = useCallback(() => formRef.current?.submit(), []);

    const termsOptions = useTermsSelectOptions();
    const roleTypesOptions = useRoleTypesSelectOptions();
    const createEditUserModalMode = useSelector(createEditBlackListItemModalModeSelector);
    const fetchedBlackListItem = useSelector(fetchedBlackListItemSelector);

    const initialValues = useMemo(() => {
        if (!fetchedBlackListItem || createEditUserModalMode === 'create') {
            return {};
        }

        return {
            ...fetchedBlackListItem,
            isTermsVisible: !!fetchedBlackListItem.terms?.length,
            terms: fetchedBlackListItem.terms?.map(value => termsOptions.find(option => option.value === value)) ?? [],
            isRoleTypesVisible: !!fetchedBlackListItem.roleTypes?.length,
            roleTypes: fetchedBlackListItem.roleTypes?.map(value => roleTypesOptions.find(option => option.value === value)) ?? [],
        };
    }, [createEditUserModalMode, fetchedBlackListItem, termsOptions, roleTypesOptions]);

    const onDeleteClickHandler = useCallback(() => {
        if (fetchedBlackListItem) {
            dispatch(
                blackListActions.setDeleteBlackListItemPopupProps({
                    isVisible: true,
                    blackListPublicId: fetchedBlackListItem.publicId as string,
                    blackListName: fetchedBlackListItem.name,
                }),
            );
        }
    }, [dispatch, fetchedBlackListItem]);

    const isNotVisible = !isOpen || (createEditUserModalMode === 'edit' && !fetchedBlackListItem);

    const headText = useMemo(() => {
        if (createEditUserModalMode !== 'create') {
            return fetchedBlackListItem?.name;
        }

        return t('add-drawer-title');
    }, [createEditUserModalMode, fetchedBlackListItem]);

    return { headText, isNotVisible, formRef, initialValues, createEditUserModalMode, onSubmit, onSubmitHandler, onDeleteClickHandler };
};
