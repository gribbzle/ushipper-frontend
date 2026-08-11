import { ContractorTypesEnum } from '@/enums/contractor-types-enum';
import { FeesRule } from '@/enums/fee/fees-rules-enum';
import { FuelCardsRule } from '@/enums/fuel/fuel-cards-rules-enum';
import { AccountConfigPatchData } from '@store/api/accounts-api';
import { FeeData, RecurringFeeData } from '@/types/fee';

export type FeeFields = {
    delayedFees: FeeData[];
    instantFees: FeeData[];
    recurringFees: RecurringFeeData[];
};

export type DeletedFeeFields = {
    [key: string]: number[];
};

export type DriverSettingsValues = Pick<
    AccountConfigPatchData,
    'driverMinimalBalance' | 'loadboardPaymentTerms' | 'ordersShowFullPrice' | 'loadboardSources' | 'orderRequestsAllowed'
> & {
    hasDriverLimitBalance: boolean;
};

export type FuelCardsSettingsValues = Pick<AccountConfigPatchData, 'fuelLimitRateNew' | 'fuelLimitRatePickedUp' | 'fuelLimitRateDef'> & {
    fuelCardsRules: FuelCardsRule;
};

export type AgreementsDetailsFormState = {
    contractorType: ContractorTypesEnum;
    rules: FeesRule;
    parentId?: string;
    driverSettings: DriverSettingsValues;
    fuelCardsSettings: FuelCardsSettingsValues;
    accountFees: FeeFields;
} & DeletedFeeFields;

export type CustomFeesData = {
    fees: {
        delayedFees: FeeData[];
        instantFees: FeeData[];
    };
    publicId: string;
};

export type DeletedCustomFeesData = { deletedFees: number[] };
