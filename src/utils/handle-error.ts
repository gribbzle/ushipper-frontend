import { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

/**
 * Handles displaying an error message from an Axios response.
 * @param exception - The exception caught in try-catch blocks.
 */

export const handleError = (exception: unknown): void => {
    const {
        data: { message },
    } = exception as AxiosResponse<AxiosError>;

    toast.error(message);
};
