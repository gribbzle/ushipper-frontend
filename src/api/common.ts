import { axios } from '@utils/axios';

import { AccountData } from '@/store/client/accounts/types';
import { AcceptInvitation, AuthorizedUserData, AuthTokenData, ChangeAccountFormData, SignInFormData } from '@/store/client/sign-in/types';
import { SignUpFormData } from '@/store/client/sign-up/types';
import { RequestResetPasswordData, ResetPasswordData } from '@/store/common/password-recovery/types';

export const fetchAuth = (authorizationHeader: string, publicUserId: string) => {
    return axios.get<AuthorizedUserData>(`/api/users/${publicUserId}`, { headers: { Authorization: authorizationHeader } });
};

export const fetchedAuthorizedUser = async (authorization: string, publicUserId: string) => {
    try {
        const response = await fetchAuth(authorization, publicUserId);
        const user = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;

        return { user, status: response.status };
    } catch (error) {
        const status = axios.isAxiosError(error) ? error.response?.status : 500;

        return { error, status };
    }
};

export const fetchAccount = async (authorizationHeader: string, accountUserId: string) => {
    return await axios.get<{ data: AccountData }>(`/api/accounts/${accountUserId}`, { headers: { Authorization: authorizationHeader } });
};

export const fetchedAuthorizedAccount = async (authorization: string, publicUserId: string) => {
    try {
        const response = await fetchAccount(authorization, publicUserId);

        return { account: response.data.data, status: response.status };
    } catch (error) {
        const status = axios.isAxiosError(error) ? error.response?.status : 500;

        return { error, status };
    }
};

export const fetchPermissions = (authorizationHeader: string, roleId: number) => {
    return axios.get(`/api/roles/${roleId}`, { headers: { Authorization: authorizationHeader } });
};

export const fetchedUserPermissions = async (authorization: string, roleId: number) => {
    try {
        const response = await fetchPermissions(authorization, roleId);

        return { permissions: response.data.data.permissions, status: response.status };
    } catch (error) {
        const status = axios.isAxiosError(error) ? error.response?.status : 500;

        return { error, status };
    }
};

export const fetchDriverPaymentRequestCounter = (authorizationHeader: string) => {
    return axios.get('/api/driver-payment-requests/counter', { headers: { Authorization: authorizationHeader } });
};

export const fetchedDriverPaymentRequestCounter = async (authorization: string) => {
    try {
        const response = await fetchDriverPaymentRequestCounter(authorization);

        return { count: response.data.data.count, status: response.status };
    } catch (error) {
        const status = axios.isAxiosError(error) ? error.response?.status : 500;

        return { error, status };
    }
};

export const fetchIssuesCounter = (authorizationHeader: string) => {
    return axios.get('/api/issues/counters', { headers: { Authorization: authorizationHeader } });
};

export const fetchedIssuesCounter = async (authorization: string) => {
    try {
        const response = await fetchIssuesCounter(authorization);

        return { pending: response.data.data.pending, status: response.status };
    } catch (error) {
        const status = axios.isAxiosError(error) ? error.response?.status : 500;

        return { error, status };
    }
};

export const signUp = async (data: SignUpFormData) => {
    // FIXME: RFF number field
    const result = await axios.post('/api/registration', {
        ...data,
        usdotNumber: data.usdotNumber ? parseInt(data.usdotNumber) : data.usdotNumber,
    });

    return result.data;
};

export const fetchSignUpConfig = async () => {
    const result = await axios.get('/api/registration');

    return result.data.data;
};

export const signIn = async (data: SignInFormData) => {
    const result = await axios.post<AuthTokenData>('/api/tokens', data);

    return result.data;
};

export const changeAccount = async (data: ChangeAccountFormData, authorizationHeader?: string) => {
    const headers = authorizationHeader ? { Authorization: authorizationHeader } : {};
    const result = await axios.post<AuthTokenData>('/api/tokens', data, { headers });

    return result.data;
};

export const fetchedAccountUserToken = async (data: ChangeAccountFormData, authorization?: string) => {
    try {
        const response = await changeAccount(data, authorization);

        return { token: response.data };
    } catch (error) {
        const status = axios.isAxiosError(error) ? error.response?.status : 500;

        return { error, status };
    }
};

export const acceptInvitation = async (data: AcceptInvitation) => {
    const result = await axios.post<AuthTokenData>('/api/tokens', data);

    return result.data;
};

export const requestResetPassword = async (data: RequestResetPasswordData) => {
    const result = await axios.post<AuthTokenData>('/api/passwords/requests', data);

    return result.data;
};

export const resetPassword = async (data: ResetPasswordData) => {
    const result = await axios.post<AuthTokenData>('/api/passwords', data);

    return result.data;
};

export const signUpConfirm = async (code: string) => {
    const result = await axios.post<AuthTokenData>('/api/confirm-registration', { verifyCode: code });

    return result.data;
};
