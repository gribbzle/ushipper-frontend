import { NullableFields } from '@/shared/nullable';
import { AccountToken } from '@store/client/sign-in/token-types';

import { AuthorizedUserInfo, Permissions } from './shared-types';

export type { AuthorizedUserInfo, Language, Permissions } from './shared-types';

export type GlobalSliceState = NullableFields<{
    user: AuthorizedUserInfo;
    account: any;
    accountUser: any;
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
