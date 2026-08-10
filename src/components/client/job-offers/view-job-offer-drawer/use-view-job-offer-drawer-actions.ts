import { useCallback, useMemo } from 'react';

import { OfferStatusesEnum } from '@/enums/offer-statuses-enum';
import { useMeCarrier } from '@/hooks/use-user-role-group';
import { jobOffersApi, usePartiallyUpdateJobOfferMutation } from '@store/api/job-offers';

import { useOpenSendJobOfferDrawer } from '../send-job-offer-drawer';

import { useViewJobOfferDrawer } from './use-view-job-offer-drawer';

export const useViewJobOfferDrawerActions = () => {
    const { jobOffer, router, dispatch, handleCloseDrawer } = useViewJobOfferDrawer();
    const { handleOpenDrawer } = useOpenSendJobOfferDrawer(jobOffer);
    const isMeCarrier = useMeCarrier();

    const isMeSender = useMemo(
        () => (isMeCarrier ? jobOffer?.type === 'company_to_user' : jobOffer?.type === 'user_to_company'),
        [isMeCarrier, jobOffer?.type],
    );

    const [updateJobOffer] = usePartiallyUpdateJobOfferMutation();

    const handleJobOfferStatusChange = useCallback(
        (status: OfferStatusesEnum) => {
            if (jobOffer) {
                updateJobOffer({
                    publicOfferId: jobOffer.publicId,
                    jobOfferData: { status },
                })
                    .unwrap()
                    .then(() => {
                        handleCloseDrawer();
                        dispatch(
                            jobOffersApi.util.invalidateTags([
                                { type: 'JobOffers', id: 'LIST' },
                                { type: 'JobOffers', id: 'Statistic' },
                            ]),
                        );
                    });
            }
        },
        [jobOffer, updateJobOffer, dispatch, handleCloseDrawer],
    );

    const openDeclinationModal = useCallback(async () => {
        if (jobOffer) {
            await router.push(
                {
                    pathname: router.pathname,
                    query: {
                        ...router.query,
                        openDeclineJobOfferId: jobOffer.publicId,
                    },
                },
                {
                    pathname: router.asPath.split('?')[0],
                    query: {
                        ...router.query,
                        openDeclineJobOfferId: jobOffer.publicId,
                    },
                },
            );
        }
    }, [router, jobOffer]);

    const openAcceptModal = useCallback(async () => {
        if (jobOffer) {
            await router.push(
                {
                    pathname: router.pathname,
                    query: {
                        ...router.query,
                        openAcceptJobOfferId: jobOffer.publicId,
                    },
                },
                {
                    pathname: router.asPath.split('?')[0],
                    query: {
                        ...router.query,
                        openAcceptJobOfferId: jobOffer.publicId,
                    },
                },
            );
        }
    }, [jobOffer, router]);

    const handleAccept = useCallback(() => {
        if (!isMeSender && isMeCarrier) {
            openAcceptModal();
        } else {
            handleJobOfferStatusChange(OfferStatusesEnum.ACCEPTED);
        }
    }, [handleJobOfferStatusChange, isMeCarrier, isMeSender, openAcceptModal]);

    const handleJobOfferEdit = useCallback(() => {
        if (jobOffer) {
            handleOpenDrawer(jobOffer.receiver.publicId, jobOffer.receiver.name);
        }
    }, [jobOffer, handleOpenDrawer]);

    return {
        isMeSender,
        handleJobOfferStatusChange,
        openDeclinationModal,
        handleCloseDrawer,
        handleJobOfferEdit,
        handleAccept,
    };
};
