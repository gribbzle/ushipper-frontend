import { FuelCardStatus } from '@/enums/fuel/fuel-card-status-enum';

export type FuelCardsFiltersFormState = {
    number: string;
    statuses: FuelCardStatus[];
    accountId: string;
    companyName: string;
};
