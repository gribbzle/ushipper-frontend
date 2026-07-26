import i18next from 'i18next';

export const translateByNamespace =
    (namespace: string) =>
    <T = string>(key: string, variables: Record<string, string | number> = {}) =>
        i18next.t(`${namespace}:${key}`, variables) as T;
