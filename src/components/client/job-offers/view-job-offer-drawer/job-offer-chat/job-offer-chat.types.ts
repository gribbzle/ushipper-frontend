import { OfferStatusesEnum } from '@/enums/offer-statuses-enum';

export type JobOfferChatProps = {
    jobOfferPublicId?: string;
    jobOffersStatus: OfferStatusesEnum;
};
