export const isNumber = (n: unknown): n is number => {
    return n !== null && n !== undefined && !Number.isNaN(n);
};

export const isString = (value: unknown): value is string => typeof value === 'string';
