import { useMemo } from 'react';

import { OfferStatusesEnum } from '@/enums/offer-statuses-enum';
import { JobOffer } from '@store/client';

const statusTimeMap = {
    [OfferStatusesEnum.NEW]: 'createdAt',
    [OfferStatusesEnum.ACCEPTED]: 'acceptedAt',
    [OfferStatusesEnum.DECLINED]: 'declinedAt',
    [OfferStatusesEnum.CANCELED]: 'default',
};

export const useJobOfferStatusInfoColumn = (status: OfferStatusesEnum, jobOffer: JobOffer) => {
    const time = useMemo(() => {
        const timeKey = statusTimeMap[status];

        if (timeKey === 'default') {
            return null;
        }

        const time = jobOffer[timeKey as keyof JobOffer];

        if (time === null || typeof time === 'string') {
            return time;
        }

        return null;
    }, [jobOffer, status]);

    return { time };
};
