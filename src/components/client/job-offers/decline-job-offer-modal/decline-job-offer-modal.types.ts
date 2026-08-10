import { DeclinationJobOfferReasonsEnum } from '@/enums/declination-reasons-enum';

export type DeclineJobOfferFormState = {
    [DeclinationJobOfferReasonsEnum.LowSalary]: boolean;
    [DeclinationJobOfferReasonsEnum.PersonalReason]: boolean;
    declineComment: string | null;
};
