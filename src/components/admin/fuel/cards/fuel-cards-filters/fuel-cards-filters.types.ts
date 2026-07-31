import { FuelCardStatus } from '@/enums';

export type FuelCardsFiltersFormState = {
    number: string;
    statuses: FuelCardStatus[];
    accountId: string;
    companyName: string;
};
