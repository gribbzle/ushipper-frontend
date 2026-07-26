import { toast } from 'react-toastify';

import { CustomCheckContractError } from '@/components/common/parsed-order-actions/use-handle-check-contract';
import { getTranslateParsedOrderNotification } from '@utils';

export const handleParsedOrderError = (error: CustomCheckContractError, errorNotification: string) => {
    const message = /^4\d{2}$/.test(error.status.toString())
        ? getTranslateParsedOrderNotification({ error: error.data.message, defaultMessage: errorNotification })
        : errorNotification;

    toast.error<string>(message);
};
