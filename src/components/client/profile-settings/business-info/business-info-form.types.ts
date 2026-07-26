import { TimeCondition } from '@/enums';

export type CategoryFields = {
    [key: string]: number[];
};

export type BusinessInfoFormState = Partial<{
    specializations: number[];
    dispatchFee: number;
    inBusinessSince: number | null;
    businessHours: TimeCondition;
    communicationLanguages: string[];
}> &
    CategoryFields;
