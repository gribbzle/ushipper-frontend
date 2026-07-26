import { useCallback, useMemo } from 'react';

import { useAppSelector } from '@store';
import { GetTokenOptions } from '@store/client';
import { authSelector } from '@store/global';

export const useAuth = () => {
    const { tokens, account, token, user } = useAppSelector(authSelector);

    const getToken = useCallback(
        (options?: GetTokenOptions): string => {
            if (options?.companyId) {
                const token = tokens?.find(token => token.companyId === options.companyId);

                if (token) {
                    return token.token;
                }
            }

            if (options?.userRoleType) {
                const user = account?.users.find(user => user.role.type === options.userRoleType);

                if (user) {
                    const token = tokens?.find(token => token.userId === user.publicId);

                    if (token) {
                        return token.token;
                    }
                }
            }

            if (token) {
                return token;
            }

            return '';
        },
        [account?.users, token, tokens],
    );

    return useMemo(() => ({ getToken, token, user }), [getToken, token, user]);
};
