import { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { useRolesOptions } from '@/components/client/job-offers/send-job-offer-drawer/send-job-offer-form/use-roles-options';
import { UserRoleType } from '@/enums';
import { useInvalidateSelectedAccountTags } from '@hooks';
import { useAppDispatch, useAppSelector } from '@store';
import { addDriverToCompanyPopupPropsSelector } from '@store/admin';
import { accountingAccountsApi } from '@store/api/accounting-accounts-api';
import { useInviteUserMutation } from '@store/api/invite-api';
import { handleError } from '@utils/handle-error';
import { translateByNamespace } from '@utils/i18n';

import { AddDriverToCompanyFormProps, AddDriverToCompanyFormState } from './add-driver-to-company-form.types';

const t = translateByNamespace('admin:accounting:owners-and-drivers:add-driver-to-company-popup:form');

export const useAddDriverToCompanyForm = ({ onAfterSubmit, formRef }: AddDriverToCompanyFormProps) => {
    const { email, name } = useAppSelector(addDriverToCompanyPopupPropsSelector);
    const [selectedCompanyId, setSelectedCompanyId] = useState<string | undefined>(undefined);

    const [addDriverToCompany] = useInviteUserMutation();
    const dispatch = useAppDispatch();
    const invalidateSelectedAccountTags = useInvalidateSelectedAccountTags();
    const rolesOptions = useRolesOptions('id', UserRoleType.CARRIER_DRIVER, selectedCompanyId?.trim() === '' ? undefined : selectedCompanyId);

    const initialValues = useMemo(
        () => ({
            email: email ?? '',
            name: name ?? '',
        }),
        [email, name],
    );

    const onSubmit = useCallback(
        async (values: AddDriverToCompanyFormState) => {
            try {
                await addDriverToCompany(values).unwrap();

                dispatch(accountingAccountsApi.util.invalidateTags([{ type: 'AccountingAccounts', id: 'LIST' }]));
                invalidateSelectedAccountTags();
                onAfterSubmit();
                toast.success(t<string>('add-driver-to-company-success'));
            } catch (exception) {
                handleError(exception);
            }
        },
        [onAfterSubmit, addDriverToCompany, dispatch, invalidateSelectedAccountTags],
    );

    const onChangeHandler = useCallback(() => {
        if (formRef.current) {
            const { companyId } = formRef.current.getState().values;

            if (companyId === selectedCompanyId) {
                return;
            }

            setSelectedCompanyId(companyId);

            formRef.current.batch(() => {
                formRef.current?.change('roleId', undefined);
                formRef.current?.change('parentUserId', undefined);
            });
        }
    }, [formRef, selectedCompanyId]);

    return {
        initialValues,
        rolesOptions,
        onSubmit,
        onChangeHandler,
    };
};
