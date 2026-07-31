import JsCookie from 'js-cookie';

import { axios } from '@utils/axios';

export const revokeToken = async () => {
    const token = JsCookie.get('TokenId');

    await axios.delete(`/api/tokens/${token}`);

    JsCookie.remove('Authorization');
    JsCookie.remove('PublicUserId');
    JsCookie.remove('TokenId');
    JsCookie.remove('PublicAccountId');
};
