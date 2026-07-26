import { OfferStatusesEnum } from '@/enums';
import { JobOffer } from '@store/client';

export type JobOfferStatusInfoColumnProps = {
    status: OfferStatusesEnum;
    jobOffer: JobOffer;
};
