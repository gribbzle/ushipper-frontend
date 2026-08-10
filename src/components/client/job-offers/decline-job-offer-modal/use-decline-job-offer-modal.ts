import { useCallback, useRef } from 'react';
import { FormApi } from 'final-form';
import { useRouter } from 'next/router';

import { DeclinationJobOfferReasonsEnum } from '@/enums/declination-reasons-enum';
import { OfferStatusesEnum } from '@/enums/offer-statuses-enum';

import { useViewJobOfferDrawerActions } from '../view-job-offer-drawer/use-view-job-offer-drawer-actions';

type FormState = {
    [DeclinationJobOfferReasonsEnum.LowSalary]: boolean;
    [DeclinationJobOfferReasonsEnum.PersonalReason]: boolean;
    declineComment: string | null;
};

export const useDeclineJobOfferModal = () => {
    const { handleJobOfferStatusChange } = useViewJobOfferDrawerActions();

    const formRef = useRef<FormApi<FormState>>();
    const router = useRouter();

    const handleSubmit = useCallback(() => undefined, []);

    const declineJobOffer = useCallback(() => handleJobOfferStatusChange(OfferStatusesEnum.DECLINED), [handleJobOfferStatusChange]);

    const onCloseHandler = useCallback(async () => {
        const newQuery = {
            ...router.query,
            openDeclineJobOfferId: null,
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

    return { onCloseHandler, declineJobOffer, handleSubmit, router, formRef };
};
