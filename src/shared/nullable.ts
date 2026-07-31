export type NullableFields<T> = { [K in keyof T]: T[K] | null };

export type NonNullableFields<T> = {
    [P in keyof T]: NonNullable<T[P]>;
};
