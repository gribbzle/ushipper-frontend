import { MouseEvent, useCallback } from 'react';

import { useIsDispatcherOwnerPage } from '@hooks';
import { useAppDispatch } from '@store';
import { fetchCompanyAction } from '@store/admin';

import { useCarrierItemBody } from '../../catalogs/catalog-item/carrier-item-body/use-carrier-item-body';
import { useDispatcherItemBody } from '../../catalogs/catalog-item/dispatcher-item-body/use-dispatcher-item-body';

export const useCompanyBriefActions = (id: string) => {
    const { handleFlaggedClick: handleCarrierFlaggedClick, handleUnFlaggedClick: handleCarrierUnFlaggedClick } = useCarrierItemBody(id);
    const { handleFlaggedClick: handleDispatcherFlaggedClick, handleUnFlaggedClick: handleDispatcherUnFlaggedClick } = useDispatcherItemBody(id);
    const isDispatcherOwnerPage = useIsDispatcherOwnerPage();
    const dispatch = useAppDispatch();

    const handleFlaggedClick = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => {
            if (isDispatcherOwnerPage) {
                handleDispatcherFlaggedClick(e);
            } else {
                handleCarrierFlaggedClick(e);
                dispatch(fetchCompanyAction(id));
            }
        },
        [dispatch, handleCarrierFlaggedClick, handleDispatcherFlaggedClick, id, isDispatcherOwnerPage],
    );

    const handleUnFlaggedClick = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => {
            if (isDispatcherOwnerPage) {
                handleDispatcherUnFlaggedClick(e);
            } else {
                handleCarrierUnFlaggedClick(e);
                dispatch(fetchCompanyAction(id));
            }
        },
        [dispatch, handleCarrierUnFlaggedClick, handleDispatcherUnFlaggedClick, id, isDispatcherOwnerPage],
    );

    return {
        handleFlaggedClick,
        handleUnFlaggedClick,
    };
};
