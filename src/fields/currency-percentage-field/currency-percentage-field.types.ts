import { FeeCategory } from '@/types/fee-category';

export type CurrencyPercentageFieldProps = {
    fieldName: string;
    prefix?: string;
    disabled?: boolean;
    selectedValue?: FeeCategory;
    hideSelectionIndicator?: boolean;
    isRequiredCurrency?: boolean;
};

export type HandleErrorProps = {
    errored: boolean;
    errorMessage: string | undefined;
};
