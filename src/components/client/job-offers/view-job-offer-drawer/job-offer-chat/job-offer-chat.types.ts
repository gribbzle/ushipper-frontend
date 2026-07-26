import { OfferStatusesEnum } from '@/enums';

export type JobOfferChatProps = {
    jobOfferPublicId?: string;
    jobOffersStatus: OfferStatusesEnum;
};
