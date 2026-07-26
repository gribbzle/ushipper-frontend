import { useCallback, useMemo, useRef, useState } from 'react';
import { FormApi } from 'final-form';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from '@store';
import { useUpdateUserJSONMutation } from '@store/api/users-api';
import { UserFormState } from '@store/common';
import { authorizedUserPublicIdSelector, authorizedUserSelector, globalActions } from '@store/global';
import { transformFormValuesToSpecializations, translateByNamespace } from '@utils';

import { BusinessInfoFormState, CategoryFields } from './business-info-form.types';

const tNotification = translateByNamespace('client:profile-settings.business-info.notifications');

const prepareBusinessInfoPayload = (values: BusinessInfoFormState) => {
    const specializations = transformFormValuesToSpecializations(values);
    const { dispatchFee, inBusinessSince, businessHours, communicationLanguages } = values;

    return {
        dispatchFee,
        inBusinessSince,
        businessHours,
        specializations,
        communicationLanguages: communicationLanguages?.map(code => ({ code })),
    } as UserFormState;
};

export const useBusinessInfoForm = () => {
    const [disabledSubmit, setDisabled] = useState(false);
    const formRef = useRef<FormApi<BusinessInfoFormState>>();
    const dispatch = useAppDispatch();
    const user = useAppSelector(authorizedUserSelector);
    const userPublicId = useAppSelector(authorizedUserPublicIdSelector);

    const [updateUser] = useUpdateUserJSONMutation();

    const handleSubmit = useCallback(
        async (values: BusinessInfoFormState) => {
            if (userPublicId) {
                const payload = prepareBusinessInfoPayload(values);

                try {
                    const result = await updateUser({ publicId: userPublicId, ...payload }).unwrap();

                    toast.success(tNotification<string>('updated-success'));

                    dispatch(globalActions.setUser(result));
                } catch (e) {
                    toast.error(tNotification<string>('update-error'));
                }
            }
        },
        [dispatch, updateUser, userPublicId],
    );

    const onChangeHandler = () => {
        if (formRef.current) {
            setDisabled(!Object.keys(formRef.current.getState().dirtyFields).length);
        }
    };

    const initialValues = useMemo<BusinessInfoFormState>(() => {
        if (!user) {
            return {};
        }

        const { specializations, dispatchFee, inBusinessSince, communicationLanguages, businessHours } = user;

        const categoryFields = specializations?.reduce((acc: CategoryFields, specialization) => {
            const key = `category-${specialization.id}`;

            acc[key] = specialization.categories.map(category => category.id);

            return acc;
        }, {});

        return {
            specializations: specializations?.map(({ id }) => id),
            dispatchFee: dispatchFee,
            inBusinessSince: inBusinessSince,
            communicationLanguages: communicationLanguages?.map(({ language }) => language),
            businessHours: businessHours,
            ...categoryFields,
        };
    }, [user]);

    return { initialValues, onChangeHandler, handleSubmit, disabledSubmit, formRef };
};
