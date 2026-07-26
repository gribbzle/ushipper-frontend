import { toSnakeCase } from 'js-convert-case';

export const toFormData = (obj: Record<string, string>) => {
    const formData = new FormData();

    Object.keys(obj).forEach(key => {
        const fieldName = key as keyof typeof obj;

        formData.append(toSnakeCase(key), String(obj[fieldName]));
    });

    return formData;
};
