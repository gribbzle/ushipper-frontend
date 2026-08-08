import { useCallback, useMemo, useRef, useState } from 'react';
import { FormApi } from 'final-form';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from '@store';
import { useUpdateUserFormDataMutation } from '@store/api/users-api';
import { authorizedUserSelector, globalActions } from '@store/global';
import { translateByNamespace } from '@utils/i18n';

import { PersonalInfoFormType as PersonalInfoFormState } from './personal-info-form.types';

import './personal-info-form.scss';

const tNotification = translateByNamespace('client:profile-settings.personal-info.notifications');

export const usePersonalInfoForm = () => {
    const dispatch = useAppDispatch();
    const [disabledSubmit, setDisabled] = useState(false);
    const formRef = useRef<FormApi<PersonalInfoFormState>>();
    const user = useAppSelector(authorizedUserSelector);
    const [updateUser] = useUpdateUserFormDataMutation();

    const handleSubmit = useCallback(
        async (values: PersonalInfoFormState) => {
            const { avatar, description = '', ...others } = values;
            const newValues: PersonalInfoFormState = { ...others, description };

            if (avatar instanceof File) {
                newValues.avatar = avatar;
            }

            if (avatar === null) {
                newValues.avatar = '';
            }

            try {
                const result = await updateUser(newValues).unwrap();

                toast.success(tNotification<string>('updated-success'));

                dispatch(globalActions.setUser(result));
            } catch {
                toast.error(tNotification<string>('update-error'));
            }
        },
        [updateUser, dispatch],
    );

    const onChangeHandler = () => {
        if (formRef.current) {
            setDisabled(!Object.keys(formRef.current.getState().dirtyFields).length);
        }
    };

    const initialValues = useMemo<PersonalInfoFormState>(() => {
        if (user) {
            const { name, avatar, email, phone, description, address, city, country, state, zip, publicId } = user;

            return {
                publicId,
                phone,
                email,
                name,
                description,
                address,
                city,
                country,
                state,
                zip,
                avatar: avatar?.url || '',
            };
        }

        return {};
    }, [user]);

    return { initialValues, formRef, onChangeHandler, handleSubmit, disabledSubmit };
};
