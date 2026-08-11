import { OfferStatusesEnum } from '@/enums/offer-statuses-enum';
import { TimeCondition } from '@/enums/time-condition';
import { UserRoleType } from '@/enums/user-role-type';
import { Attachment, Creator } from '@/shared/types';
import { Company } from '@store/admin';

export type TermCondition =
    | '1_month'
    | '2_months'
    | '3_months'
    | '4_months'
    | '5_months'
    | '6_months'
    | '7_months'
    | '8_months'
    | '9_months'
    | '10_months'
    | '11_months'
    | '12_months';

export type JobOffer = {
    publicId: string;
    receiver: Creator & { publicId: string };
    status: OfferStatusesEnum;
    offeringCompany: Company;
    offeredRole: UserRoleType;
    creator: Creator;
    businessHours: TimeCondition;
    dispatchFee: number;
    term: TermCondition;
    startDate: string;
    description: string;
    declineReasons: ('low_salary' | 'personal_reason')[];
    declineComment: string | null;
    acceptedAt: string | null;
    declinedAt: string | null;
    createdAt: string;
    attachments: Attachment[];
    type: 'user_to_company' | 'company_to_user';
};

export type SendJobOfferDrawerPropsState = {
    isDrawerOpened: boolean;
    id: string | null;
    to: string | null;
    jobOffer?: JobOffer | null;
};

export type JobOffersSliceState = {
    sendJobOfferDrawerProps: SendJobOfferDrawerPropsState;
};
