import { useCallback, useRef } from 'react';
import { FormApi } from 'final-form';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { OfferStatusesEnum } from '@/enums';
import { useGetJobOfferQuery, usePartiallyUpdateJobOfferMutation } from '@store/api/job-offers';
import { translateByNamespace } from '@utils/i18n';

import { AcceptJobOfferFormValue } from './accept-job-offer-modal.types';

const t = translateByNamespace('client:order-offers:action-modal');

export const useAcceptJobOfferModal = () => {
    const formRef = useRef<FormApi<AcceptJobOfferFormValue>>();
    const router = useRouter();
    const [updateJobOffer] = usePartiallyUpdateJobOfferMutation();
    const publicOfferId = router.query.openAcceptJobOfferId;

    const { data: jobOffer } = useGetJobOfferQuery(publicOfferId as string, { skip: !publicOfferId });

    const handleAction = useCallback(() => {
        if (formRef.current) {
            formRef.current.submit();
        }
    }, []);

    const handleClose = useCallback(async () => {
        const newQuery = {
            ...router.query,
            openAcceptJobOfferId: null,
        };

        await router.push(
            {
                pathname: router.pathname,
                query: newQuery,
            },
            {
                pathname: router.asPath.split('?')[0],
                query: newQuery,
            },
        );
    }, [router]);

    const handleSubmit = useCallback(
        async ({ roleType }: AcceptJobOfferFormValue) => {
            if (publicOfferId && typeof publicOfferId === 'string') {
                try {
                    await updateJobOffer({
                        publicOfferId,
                        jobOfferData: { status: OfferStatusesEnum.ACCEPTED, roleType },
                    }).unwrap();

                    handleClose();
                    toast.success(t<string>('accept-success'));
                } catch (error) {
                    toast.success(t<string>('accept-error'));
                }
            }
        },
        [publicOfferId, updateJobOffer, handleClose],
    );

    return {
        formRef,
        handleClose,
        handleAction,
        handleSubmit,
        jobOffer,
    };
};
