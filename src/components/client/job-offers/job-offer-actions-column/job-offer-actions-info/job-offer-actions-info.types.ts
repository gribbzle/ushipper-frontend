import { OfferStatusesEnum } from '@/enums/offer-statuses-enum';
import { Creator } from '@/shared/types';
import { Company } from '@store/admin';

type ActionsInfo = {
    offeringCompany: Company;
    receiver: Creator;
    creator: Creator;
    createdAt: string;
    acceptedAt: string | null;
    status: OfferStatusesEnum;
    declinedAt: string | null;
    type: 'user_to_company' | 'company_to_user';
};

export type JobOfferActionsInfoProps = {
    info: ActionsInfo;
};
