import React, { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';

import { Button } from '@/components/common/button/button';
import { CloseButton } from '@/components/common/button/CloseButton';
import { Popup } from '@/components/common/popup/popup';
import { useAppDispatch, useAppSelector } from '@store';
import { fuelActions, unassignDriverFromFuelCardPopupPropsSelector } from '@store/admin';
import { fuelCardsApi, usePartiallyUpdateFuelCardMutation } from '@store/api/fuel-cards-api';
import { getCompanyTypeTranslate } from '@utils/get-company-type-translate';
import { translateByNamespace } from '@utils/i18n';
import { renderTextWithBreakLines } from '@utils/render';

const t = translateByNamespace('admin:fuel:cards-page:unassign-driver-from-fuel-card-popup');
const tNot = translateByNamespace('admin:fuel:cards-page:notifications');

export const UnassignDriverFromFuelCardPopup = () => {
    const dispatch = useAppDispatch();
    const [updateFuelCard] = usePartiallyUpdateFuelCardMutation();
    const { fuelCard, isPopupOpened } = useAppSelector(unassignDriverFromFuelCardPopupPropsSelector);

    const onCloseHandler = useCallback(
        () => dispatch(fuelActions.setUnassignDriverFromFuelCardPopupProps({ isPopupOpened: false, fuelCard: null })),
        [dispatch],
    );

    const onUnassignDriverClickHandler = useCallback(async () => {
        if (fuelCard) {
            try {
                await updateFuelCard({ fuelCardId: fuelCard.id, data: { accountId: null } }).unwrap();
                dispatch(fuelCardsApi.util.invalidateTags([{ type: 'FuelCards', id: 'LIST' }]));

                onCloseHandler();
                toast.success(tNot<string>('unassign-driver-from-fuel-card-success'));
            } catch {
                toast.error(tNot<string>('unassign-driver-from-fuel-card-error'));
            }
        }
    }, [dispatch, updateFuelCard, onCloseHandler, fuelCard]);

    const actions = useMemo(
        () => (
            <>
                <>
                    <Button view='danger' size='small' onClick={onUnassignDriverClickHandler}>
                        {t('unassign')}
                    </Button>
                    <CloseButton onClick={onCloseHandler} />
                </>
            </>
        ),
        [onCloseHandler, onUnassignDriverClickHandler],
    );

    return (
        <Popup
            isOpen={isPopupOpened}
            onTop={true}
            onClose={onCloseHandler}
            title={renderTextWithBreakLines(
                t('title', { driverName: fuelCard?.account?.name ?? getCompanyTypeTranslate('driver'), cardNumber: fuelCard?.number ?? '' }),
            )}
            actions={actions}
            size='medium'
        />
    );
};
