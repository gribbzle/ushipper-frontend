import { toast } from 'react-toastify';

export type BackError = {
    status: number;
    data: { message: string; errors: Record<string, string> };
};

export const processError = ({ data }: BackError) => {
    const errorMessage = data.errors[Object.keys(data.errors)[0]][0];

    toast.error(errorMessage);
};
