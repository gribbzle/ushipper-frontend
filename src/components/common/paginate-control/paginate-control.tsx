import React, { useRef } from 'react';
import { Field, Form } from 'react-final-form';

import { classname, numberWithCommas, translateByNamespace } from '@utils';

import { Paginate } from '../paginate/paginate';

import { PerPageSelect } from './per-page-select';

import './paginate-control.scss';

type PaginateControlProps = {
    page: number;
    lastPage: number;
    onPageChange: (page: number) => void;
    onChangePerPage: (perPage: number) => void;
    perPage: number;
    from: number;
    to: number;
    total: number;
    className?: string;
};

type PerPageFormValues = {
    perPage: number;
};

const cn = classname('paginate-control');
const t = translateByNamespace('common:paginate-control');

export const PaginateControl = ({ page, lastPage, onPageChange, perPage, onChangePerPage, from, to, total, className }: PaginateControlProps) => {
    const initialValuesRef = useRef<PerPageFormValues>({ perPage });

    const initialValues = initialValuesRef.current;

    return (
        <div className={cn('', [className])}>
            <Paginate page={page} lastPage={lastPage} onChange={onPageChange} />
            <Form<PerPageFormValues>
                onSubmit={values => onChangePerPage(values.perPage)}
                subscription={{ values: true }}
                initialValues={initialValues}
                render={({ handleSubmit }) => (
                    <form className={cn('form')} onSubmit={handleSubmit}>
                        <div className={cn('per-page-selector')}>
                            <Field name='perPage' component={PerPageSelect} callback={onChangePerPage} />
                            <span className={cn('per-page-selector-label')}>{t('label', { from, to, total: numberWithCommas(total) })}</span>
                        </div>
                    </form>
                )}
            />
        </div>
    );
};
