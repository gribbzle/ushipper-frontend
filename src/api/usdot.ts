import { axios } from '@utils';

export const usdotVerify = async (usdotId: string) => {
    const result = await axios.get(`/api/usdots/${usdotId}`);

    return result.data;
};
