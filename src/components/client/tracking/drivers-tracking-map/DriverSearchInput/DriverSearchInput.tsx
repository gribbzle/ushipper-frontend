import React, { useCallback } from 'react';
import { Field, Form } from 'react-final-form';

import { StringInput } from '@fields';
import { useDriverTrackingMap } from '@hooks';
import { SearchIcon, XBigIcon } from '@icons';
import { classname } from '@utils/classname';
import { FormValuesSpy } from '@utils/form';
import { translateByNamespace } from '@utils/i18n';

import './styles.scss';

type SearchForm = {
    searchValue?: string;
};

const cn = classname('driver-search-input');
const t = translateByNamespace('client:tracking-page');

const DriverSearchInput = (): JSX.Element => {
    const { setConfig } = useDriverTrackingMap();

    const handleInputChange = useCallback(
        ({ searchValue }: SearchForm): void => {
            setConfig({ query: searchValue });
        },
        [setConfig],
    );

    return (
        <div className={cn('')}>
            <Form<SearchForm>
                onSubmit={handleInputChange}
                subscription={{ values: true }}
                initialValues={{ searchValue: '' }}
                render={({ handleSubmit, values, form }): JSX.Element => (
                    <form className={cn('form')} onSubmit={handleSubmit}>
                        <FormValuesSpy onChange={handleInputChange} debounceTime={500} />
                        <Field name='searchValue' component={StringInput} placeholder={t('search-by-name-or-order-id')} />
                        <div className={cn('buttons')}>
                            <button className={cn('search-button')} type='submit'>
                                <SearchIcon />
                            </button>
                            {values.searchValue && (
                                <button
                                    className={cn('clear-button')}
                                    onClick={(): void => {
                                        form.change('searchValue', '');
                                    }}
                                >
                                    <XBigIcon />
                                </button>
                            )}
                        </div>
                    </form>
                )}
            />
        </div>
    );
};

export default DriverSearchInput;
