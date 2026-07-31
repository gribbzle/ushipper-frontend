export const getId: <T extends Record<string, unknown>>(row: T) => string = row => (row.id || row.publicId) as string;
