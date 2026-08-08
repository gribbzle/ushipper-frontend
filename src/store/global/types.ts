import { NullableFields } from '@/shared/nullable';
import { AccountToken } from '@store/client/sign-in/token-types';
import { AccountData, AccountUser } from '@/store/client/accounts/types';

import { AuthorizedUserInfo, Permissions } from './shared-types';
export type { AuthorizedUserInfo, Language, Permissions } from './shared-types';

export type GlobalSliceState = NullableFields<{
    user: AuthorizedUserInfo;
    account: AccountData;
    accountUser: AccountUser;
    token: string;
    tokens: AccountToken[];
    fetchUserStatus: number;
    permissions: Permissions;
    fetchPermissionsStatus: number;
    driverPaymentRequestsCounter: number;
    driverPaymentRequestsCounterStatus: number;
    issuesCounter: number;
    issuesCounterStatus: number;
}>;
