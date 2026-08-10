import { OfferStatusesEnum } from '@/enums/offer-statuses-enum';
import { JobOffer } from '@store/client';

export type JobOfferStatusInfoColumnProps = {
    status: OfferStatusesEnum;
    jobOffer: JobOffer;
};
