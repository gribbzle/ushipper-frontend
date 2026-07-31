import { FuelCardStatus, FuelTransactionStatus } from '@/enums';
import { NullableFields } from '@/shared';
import { Avatar } from '@/store/common/staff/avatar-types';
import { DriverParent } from '@/store/common/staff/types';

import { BalanceResource } from '../accounting/balance-types';

export type FuelCardAccount = {
    publicId: string;
    name: string;
    defaultBalance: BalanceResource | null;
    avatar: Avatar | null;
    parent: DriverParent | null;
};

type FuelCardInfo = {
    infoId: string;
    lengthCheck: boolean;
    matchValue: string | null;
    maximum: number | null;
    minimum: number | null;
    reportValue: string;
    validationType: string;
    value: number | null;
};

export type FuelCardRawDataHeader = Partial<
    NullableFields<{
        lastTransaction: number;
        lastUsedDate: string;
    }>
>;

export type FuelCardRawData = Partial<
    NullableFields<{
        cardNumber: string;
        locationGroups: number;
        header: FuelCardRawDataHeader;
        infos: FuelCardInfo[];
    }>
>;

export type AvailableLimit = {
    def: number | null; // Integer
    defGal: number | null;
    ulsd: number | null; // Integer
    ulsdGal: number | null;
};

export type FuelCard = {
    id: number;
    number: string;
    status: FuelCardStatus;
    createdAt: string;
    rawData: FuelCardRawData;
    account: FuelCardAccount | null;
    limit: number | null;
    limitDef: number | null;
    limitDefGal: number | null;
    limitUlsdGal: number | null;
    available: AvailableLimit | null;
    wexAccount: string;
};

export type FuelTransactionLocation = Partial<{
    address1: string | null;
    address2: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    country: string | null;
}>;

export type FuelTransactionLineItem = {
    [key: string]: any;
};

export type FuelTransactionRawData = {
    lineItems?: FuelTransactionLineItem[] | FuelTransactionLineItem;
    [key: string]: any;
};

export type FuelTransaction = {
    id: number;
    externalId: string;
    fuelCard: FuelCard;
    transactionId: string;
    status: FuelTransactionStatus;
    cardNumber: string;
    driverName: string | null;
    carrierFee: number;
    discountAmount: number;
    fundedTotal: number;
    settleAmount: number;
    createdAt: string;
    happenedAt: string;
    rawData: FuelTransactionRawData;
    location: FuelTransactionLocation;
};

export type AddFuelCardToDriverPopupPropsState = {
    isPopupOpened: boolean;
    fuelCard: FuelCard | null;
};

export type UnassignDriverFromFuelCardPopupPropsState = AddFuelCardToDriverPopupPropsState;

export type EditFuelCardPopupPropsState = AddFuelCardToDriverPopupPropsState & {
    isLoading: boolean;
};

export type FuelTransactionDetailsDrawerPropsState = {
    isPopupOpened: boolean;
    fuelTransaction: FuelTransaction | null;
};

export type FuelSliceState = {
    addFuelCardToDriverPopupProps: AddFuelCardToDriverPopupPropsState;
    unassignDriverFromFuelCardPopupProps: UnassignDriverFromFuelCardPopupPropsState;
    fuelTransactionDetailsDrawerProps: FuelTransactionDetailsDrawerPropsState;
    editFuelCardPopupProps: EditFuelCardPopupPropsState;
};
