import { useCallback } from 'react';

import { useAppDispatch } from '@store';
import { JobOffer } from '@store/client';
import { setSendJobOfferDrawerProps } from '@store/client/job-offers/slice';

export const useOpenSendJobOfferDrawer = (jobOffer?: JobOffer) => {
    const dispatch = useAppDispatch();

    const handleOpenDrawer = useCallback(
        (id: string, to: string) => {
            dispatch(setSendJobOfferDrawerProps({ id, to, isDrawerOpened: true, jobOffer }));
        },
        [dispatch, jobOffer],
    );

    return {
        handleOpenDrawer,
    };
};
