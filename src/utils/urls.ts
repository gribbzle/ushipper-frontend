export const buildQueryString = (params: Record<string, unknown>): string =>
    Object.entries(params)
        .filter(([, value]) => value !== undefined)
        .flatMap(([key, value]) =>
            (Array.isArray(value) ? value : [value]).map(item => `${key}${Array.isArray(value) ? '[]' : ''}=${encodeURIComponent(item)}`),
        )
        .join('&');
