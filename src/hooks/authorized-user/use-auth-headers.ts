import { useMemo } from 'react';

import { GetTokenOptions } from '@store/client';

import { useAuth } from './use-auth';

export const useAuthHeaders = (tokenOptions: GetTokenOptions) => {
    const { getToken } = useAuth();
    const token = useMemo(() => getToken(tokenOptions), [getToken, tokenOptions]);

    return token
        ? {
              headers: {
                  Authorization: token,
              },
          }
        : {};
};
