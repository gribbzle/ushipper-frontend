export type FieldValue = Date | boolean | string | undefined | null | number;
export type FieldValueArray = (string | number)[] | undefined | null;
export type FieldValidator = (value: FieldValue) => string | undefined | null;
export type FieldValidatorArray = (value: FieldValueArray) => string | undefined | null;
export type FileValidator = (value: File | File[] | null | undefined) => string | undefined;
