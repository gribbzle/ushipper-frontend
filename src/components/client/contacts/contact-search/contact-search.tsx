import React, { useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

import { NativeInput } from '@fields';
import { useDebounce } from '@hooks';
import { useAppDispatch } from '@store';
import { fetchContactsAction } from '@store/common';
import { contactsActions } from '@store/common/contacts/slice';
import { classname, translateByNamespace } from '@utils';

import './contact-search.scss';

const t = translateByNamespace('common:contact-search');
const cn = classname('contact-search');

export const ContactSearch = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();

    const [search, setSearch] = useState(params.get('search') ?? '');

    const handleSubmit = () => {
        dispatch(contactsActions.setFilters({ page: 1, search }));

        router.replace(
            {
                query: {
                    ...router.query,
                    search,
                },
            },
            {
                pathname,
                query: {
                    ...router.query,
                    search,
                },
            },
            {
                shallow: true,
            },
        );

        dispatch(fetchContactsAction());
    };

    const debouncedOnChange = useDebounce(handleSubmit);

    return (
        <NativeInput
            value={search}
            className={cn()}
            name='search'
            placeholder={t('search-field-placeholder')}
            onChange={e => {
                setSearch(e.target.value);
                debouncedOnChange();
            }}
        />
    );
};
