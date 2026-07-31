import React, { memo, useCallback, useMemo, useRef } from 'react';
import { debounce } from 'debounce';
import { FormApi } from 'final-form';
import { useRouter } from 'next/router';
import { Field, Form } from 'react-final-form';

import { FormControl, TextField } from '@fields';
import { useEffectOnce } from '@hooks';
import { useAppDispatch } from '@store';
import { fetchBlackListItemsAction } from '@store/client';
import { blackListActions } from '@store/common/black-list/slice';
import { classname } from '@utils/classname';
import { FormValuesSpy } from '@utils/form';
import { translateByNamespace } from '@utils/i18n';

import './black-list-items-filters.scss';

const t = translateByNamespace('common:black-list-page');
const cn = classname('black-list-items-filters');

type BlackListItemsFiltersFormState = {
    page?: number;
    query?: string;
};

export const BlackListItemsFilters = memo(() => {
    const dispatch = useAppDispatch();
    const isFirstRenderRef = useRef(true);
    const formRef = useRef<FormApi<BlackListItemsFiltersFormState>>();
    const router = useRouter();

    const debouncedFetchBlackListItems = useMemo(
        () =>
            debounce(() => {
                dispatch(fetchBlackListItemsAction());
            }),
        [dispatch],
    );

    const onChangeHandler = useCallback(
        ({ query }: BlackListItemsFiltersFormState) => {
            if (isFirstRenderRef.current) {
                isFirstRenderRef.current = false;

                return;
            }

            dispatch(blackListActions.setFilters({ page: 1, query }));

            router.replace({ pathname: router.pathname, query: { ...(query && { query }), page: 1, perPage: router.query.perPage ?? 20 } });
            debouncedFetchBlackListItems();
        },
        [debouncedFetchBlackListItems, dispatch, router],
    );

    const getInitialFormStateFromUrlParams = (): BlackListItemsFiltersFormState => {
        const { query } = router.query;
        const formState: BlackListItemsFiltersFormState = {};

        if (query && typeof query === 'string') {
            formState.query = query;
        }

        return formState;
    };

    useEffectOnce(() => {
        formRef.current?.initialize(getInitialFormStateFromUrlParams());
    });

    return (
        <Form<BlackListItemsFiltersFormState>
            onSubmit={onChangeHandler}
            subscription={{ values: true }}
            render={({ form, handleSubmit }) => {
                formRef.current = form;

                return (
                    <form className={cn()} onSubmit={handleSubmit}>
                        <FormValuesSpy onChange={onChangeHandler} debounceTime={300} />
                        <FormControl>
                            <Field name='query' component={TextField} placeholder={t('search-by-name-filter-placeholder')} />
                        </FormControl>
                    </form>
                );
            }}
        />
    );
});

BlackListItemsFilters.displayName = 'BlackListItemsFilters';
