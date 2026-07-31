import { UserRoleType } from '@/enums';
import { AuthorizedUserInfo } from '@store/global/shared-types';

export type SignInFormData = {
    login: string;
    password: string;
};

export type ChangeAccountFormData = {
    userPublicId: string;
    grantType: string;
};

export type AcceptInvitation = {
    code: string;
    grantType: string;
};

export type Token = {
    id: string;
    token: string;
    userId: string;
    accountId: string;
};

export type AuthTokenData = {
    data: Token;
};

export type GetTokenOptions = {
    companyId?: string | null;
    userRoleType?: UserRoleType;
};

export type AuthorizedUserData = {
    data: Array<AuthorizedUserInfo> | AuthorizedUserInfo;
};
