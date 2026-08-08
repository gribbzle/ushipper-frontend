import { AxiosError, AxiosResponse } from 'axios';

const createErrorObj = (errorsObj: any) => {
    try {
        if (errorsObj) {
            return Object.entries(errorsObj).reduce<Record<string, string>>((acc, currentValue) => {
                const errorsMessages = currentValue[1] as string[];

                return {
                    ...acc,
                    [currentValue[0]]: errorsMessages[0],
                };
            }, {});
        } else {
            return {};
        }
    } catch {
        return {};
    }
};

export default function parseValidationFields(error: unknown): Record<string, string> {
    const errors = {};

    if (error instanceof AxiosError) {
        const errorsObj = error.response?.data?.errors;

        return createErrorObj(errorsObj);
    }

    const errorAsResponse = (error as AxiosResponse | undefined)?.data?.errors;

    if (errorAsResponse) {
        return createErrorObj(errorAsResponse);
    }

    return errors;
}
