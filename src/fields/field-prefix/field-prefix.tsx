import React, { createContext, FC, ReactNode } from 'react';
import { Field, FieldProps } from 'react-final-form';

import { FieldValue, FieldValueArray } from '@/validators/types';

interface FieldPrefixContextProps {
    prefix: string;
}

export const FieldPrefixContext = createContext<FieldPrefixContextProps>({ prefix: '' });

interface FieldPrefixProps {
    prefix: string;
    children: ReactNode;
}

const FieldPrefix: FC<FieldPrefixProps> = ({ prefix, children }) => <FieldPrefixContext.Provider value={{ prefix }}>{children}</FieldPrefixContext.Provider>;

type PrefixedFieldProps = FieldProps<FieldValue, never> & {
    name: string;
};

type PrefixedFieldArrayProps = FieldProps<FieldValueArray, never> & {
    name: string;
};

const PrefixedField: FC<PrefixedFieldProps> = ({ name, ...props }) => (
    <FieldPrefixContext.Consumer>{({ prefix }) => <Field name={`${prefix}.${name}`} {...props} />}</FieldPrefixContext.Consumer>
);

const PrefixedFieldArray: FC<PrefixedFieldArrayProps> = ({ name, ...props }) => (
    <FieldPrefixContext.Consumer>{({ prefix }) => <Field name={`${prefix}.${name}`} {...props} />}</FieldPrefixContext.Consumer>
);

export { FieldPrefix, PrefixedField, PrefixedFieldArray };
