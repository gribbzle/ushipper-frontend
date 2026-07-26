import { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from '@store';
import { addFuelCardToDriverPopupPropsSelector } from '@store/admin';
import { fuelCardsApi, usePartiallyUpdateFuelCardMutation } from '@store/api/fuel-cards-api';
import { translateByNamespace } from '@utils';

import { AddFuelCardToDriverFormProps, AddFuelCardToDriverFormState } from './add-fuel-card-to-driver-form';

const t = translateByNamespace('admin:fuel:cards-page:notifications');

export const useFuelCardToDriverForm = ({ onAfterSubmit }: Pick<AddFuelCardToDriverFormProps, 'onAfterSubmit'>) => {
    const { fuelCard } = useAppSelector(addFuelCardToDriverPopupPropsSelector);

    const [updateFuelCard] = usePartiallyUpdateFuelCardMutation();
    const dispatch = useAppDispatch();

    const initialValues = useMemo(
        () => ({
            accountId: fuelCard?.account?.publicId ?? '',
        }),
        [fuelCard],
    );

    const onSubmit = useCallback(
        async (values: AddFuelCardToDriverFormState) => {
            if (fuelCard) {
                const { id, account } = fuelCard;
                const mode = account?.publicId ? 'edit' : 'add';

                try {
                    await updateFuelCard({ fuelCardId: id, data: values }).unwrap();
                    dispatch(fuelCardsApi.util.invalidateTags([{ type: 'FuelCards', id: 'LIST' }]));

                    onAfterSubmit();
                    toast.success(t<string>(`${mode}-fuel-cards-to-driver-success`));
                } catch (exception) {
                    toast.error(t<string>(`${mode}-fuel-cards-to-driver-error`));
                }
            }
        },
        [onAfterSubmit, updateFuelCard, dispatch, fuelCard],
    );

    return {
        initialValues,
        onSubmit,
    };
};
