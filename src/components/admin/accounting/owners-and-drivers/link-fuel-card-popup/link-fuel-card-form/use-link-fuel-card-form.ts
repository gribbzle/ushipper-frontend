import { useCallback } from 'react';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from '@store';
import { linkFuelCardPopupPropsSelector } from '@store/admin';
import { fuelCardsApi, usePartiallyUpdateFuelCardMutation } from '@store/api/fuel-cards-api';
import { translateByNamespace } from '@utils/i18n';

import { LinkFuelCardFormProps, LinkFuelCardFormState } from './link-fuel-card-form.types';

const t = translateByNamespace('admin:accounting:notifications');

export const useLinkFuelCardForm = ({ onAfterSubmit }: Pick<LinkFuelCardFormProps, 'onAfterSubmit'>) => {
    const { accountId } = useAppSelector(linkFuelCardPopupPropsSelector);

    const [updateFuelCard] = usePartiallyUpdateFuelCardMutation();
    const dispatch = useAppDispatch();

    const onSubmit = useCallback(
        async (values: LinkFuelCardFormState) => {
            if (accountId) {
                try {
                    await updateFuelCard({ fuelCardId: values.fuelCardId, data: { accountId } }).unwrap();
                    dispatch(fuelCardsApi.util.invalidateTags([{ type: 'FuelCards', id: 'LIST' }]));

                    onAfterSubmit();
                    toast.success<string>(t('add-fuel-card-for-driver-success'));
                } catch (exception) {
                    toast.error<string>(t('add-fuel-card-for-driver-error'));
                }
            }
        },
        [onAfterSubmit, updateFuelCard, dispatch, accountId],
    );

    return {
        onSubmit,
    };
};
