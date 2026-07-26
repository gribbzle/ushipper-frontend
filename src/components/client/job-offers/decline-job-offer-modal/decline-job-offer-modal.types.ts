import { DeclinationJobOfferReasonsEnum } from '@/enums';

export type DeclineJobOfferFormState = {
    [DeclinationJobOfferReasonsEnum.LowSalary]: boolean;
    [DeclinationJobOfferReasonsEnum.PersonalReason]: boolean;
    declineComment: string | null;
};
