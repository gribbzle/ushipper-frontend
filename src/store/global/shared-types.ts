import { CompanyStatusEnum, SidebarCountsEnum, TimeCondition, UserRoleGroup, UserRoleType } from '@/enums';
import { BalanceResource } from '@store/admin/accounting/balance-types';
import { Specialization } from '@store/common/specialization/types';
import { Avatar } from '@store/common/staff/avatar-types';

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
