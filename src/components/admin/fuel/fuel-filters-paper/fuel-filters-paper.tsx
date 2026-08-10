import React, { ReactNode } from 'react';
import { FormApi } from 'final-form';
import { Form } from 'react-final-form';

import { Paper } from '@/components/common/paper/paper';
import { AppFilters } from '@/hooks/filters/use-query-filters';
import { classname } from '@utils/classname';
import { FormValuesSpy } from '@utils/form';

import './fuel-filters-paper.scss';

type FuelFiltersPaperProps<T> = {
    fields: ReactNode;
    handleFiltersChange: (values: T | AppFilters, touched: boolean | FormApi<T>) => void;
    initialValues: T;
};

const cn = classname('fuel-filters');

export const FuelFiltersPaper = <T extends Record<string, unknown>>({ fields, initialValues, handleFiltersChange }: FuelFiltersPaperProps<T>) => (
    <Paper
        bodyClassName={cn()}
        body={
            <Form<T>
                onSubmit={handleFiltersChange}
                initialValues={initialValues}
                subscription={{ values: true }}
                render={({ handleSubmit }) => (
                    <form className={cn('form')} onSubmit={handleSubmit}>
                        <FormValuesSpy onChange={handleFiltersChange} debounceTime={300} />
                        {fields}
                    </form>
                )}
            />
        }
    />
);
