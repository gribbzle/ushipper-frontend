import { CompanyStatusEnum, SidebarCountsEnum, TimeCondition, UserRoleGroup, UserRoleType } from '@/enums';
import { NullableFields } from '@/shared';
import { BalanceResource } from '@store/admin';
import { AccountToken } from '@store/client';
import { AccountData, AccountUser } from '@store/client/accounts';
import { Avatar, Specialization } from '@store/common';

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

export type Language = {
    language: string;
};

export type AuthorizedUserInfo = {
    accountPublicId: string;
    publicId: string;
    name: string;
    nickname?: string;
    email: string;
    phone: string;
    role: string;
    roleId: number;
    roleGroup: UserRoleGroup;
    companyName: string | null;
    roleName: string;
    roleType: UserRoleType;
    status: CompanyStatusEnum;
    avatar: Avatar | null;
    companyPublicId: string;
    unreadChatMessagesCount: number;
    countOfUnreadNotifications: number;
    specializations?: Specialization[];
    description: string;
    dispatchFee: number | null;
    inBusinessSince: number | null;
    businessHours: TimeCondition;
    address: string | null;
    city: string | null;
    country: string | null;
    state: string | null;
    zip: string | null;
    communicationLanguages: Language[];
    createdAt: string;
    dispatchedLoadsCount: number;
    avgMileCost: number;
    rating: number | null;
    reviewsTotal: number | null;
    isFlagged: boolean;
    superiorUserPublicId: string;
    twilioPhone?: string;
    balances: BalanceResource[];
    [SidebarCountsEnum.countOfNewRequests]?: number;
    [SidebarCountsEnum.countOfNewOffers]?: number;
    [SidebarCountsEnum.countOfNewOrders]?: number;
};

export type Permissions = {
    [key: string]: string[];
};
