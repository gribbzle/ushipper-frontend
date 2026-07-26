export interface SavedSearch<Type extends string, T> {
    name: string;
    type: Type;
    filters: T;
    publicId: string;
}
