import { useCallback, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from '@store';
import { editFuelCardPopupPropsSelector, fuelActions } from '@store/admin';
import { useGetAdminConfigQuery } from '@store/api/admin-configuration';
import { fuelCardsApi, usePartiallyUpdateFuelCardMutation } from '@store/api/fuel-cards-api';
import { translateByNamespace } from '@utils/i18n';

import { EditFuelCardFormState, EditFuelCardToDriverFormProps } from './edit-fuel-card-form.types';

const t = translateByNamespace('admin:fuel:cards-page:notifications');

export const useEditFuelCardForm = ({ onAfterSubmit }: Pick<EditFuelCardToDriverFormProps, 'onAfterSubmit'>) => {
    const { fuelCard } = useAppSelector(editFuelCardPopupPropsSelector);
    const { data: config } = useGetAdminConfigQuery();

    const [updateFuelCard, { isLoading }] = usePartiallyUpdateFuelCardMutation();
    const dispatch = useAppDispatch();

    const initialValues = useMemo(
        () => ({
            limit: fuelCard?.limit ?? undefined,
            limitDef: fuelCard?.limitDef ?? undefined,
            hasLimit: fuelCard?.limit != null,
        }),
        [fuelCard],
    );

    useEffect(() => {
        dispatch(
            fuelActions.setEditFuelCardPopupProps({
                isLoading,
            }),
        );
    }, [dispatch, isLoading]);

    const onSubmit = useCallback(
        async ({ hasLimit, ...rest }: EditFuelCardFormState) => {
            if (fuelCard) {
                const { id } = fuelCard;
                const payload = {
                    fuelCardId: id,
                    data: hasLimit ? { ...rest } : { limit: null, limitDef: null },
                };

                try {
                    await updateFuelCard(payload).unwrap();
                    dispatch(fuelCardsApi.util.invalidateTags([{ type: 'FuelCards', id: 'LIST' }]));

                    onAfterSubmit();
                    toast.success(t<string>('edit-fuel-cards-success'));
                } catch {
                    toast.error(t<string>('edit-fuel-cards-error'));
                }
            }
        },
        [onAfterSubmit, updateFuelCard, dispatch, fuelCard],
    );

    const { ulsdConversionRate, defConversionRate } = useMemo(() => {
        const ulsdConversionRate = config?.fuelCards?.ulsdConversionRate ?? 0;
        const defConversionRate = config?.fuelCards?.defConversionRate ?? 0;

        return { ulsdConversionRate, defConversionRate };
    }, [config]);

    return { initialValues, ulsdConversionRate, defConversionRate, onSubmit };
};
