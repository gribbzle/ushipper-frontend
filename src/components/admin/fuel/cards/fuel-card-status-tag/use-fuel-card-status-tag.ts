import { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';

import { FuelCardStatusTagProps } from '@/components/admin/fuel/cards/fuel-card-status-tag/fuel-card-status-tag.types';
import { DropdownOption } from '@/components/common/dropdown/dropdown';
import { FuelCardStatus } from '@/enums';
import { useAppDispatch } from '@store';
import { fuelCardsApi, usePartiallyUpdateFuelCardMutation } from '@store/api/fuel-cards-api';
import { translateByNamespace } from '@utils/i18n';
import { getFuelCardStatusOptionTranslate } from '@utils/translate/fuel/get-fuel-card-status-translate';

const t = translateByNamespace('admin:fuel:cards-page:notifications');

export const useFuelCardStatusTag = ({ status, id }: FuelCardStatusTagProps) => {
    const dispatch = useAppDispatch();
    const [updateFuelCard] = usePartiallyUpdateFuelCardMutation();

    const handleUpdateFuelCardStatus = useCallback(
        async (status: FuelCardStatus) => {
            try {
                await updateFuelCard({ fuelCardId: id, data: { status } }).unwrap();

                dispatch(fuelCardsApi.util.invalidateTags([{ type: 'FuelCards', id: 'LIST' }]));
                toast.success(t<string>('updated-fuel-card-status-success'));
            } catch (exception) {
                toast.error(t<string>('updated-fuel-card-status-error'));
            }
        },
        [dispatch, id, updateFuelCard],
    );

    const options: DropdownOption[] = useMemo(() => {
        return Object.values(FuelCardStatus)
            .filter(value => value !== status)
            .map(value => ({
                label: getFuelCardStatusOptionTranslate(value),
                onClick: () => handleUpdateFuelCardStatus(value),
            }));
    }, [handleUpdateFuelCardStatus, status]);

    return { options };
};
