import React, { useCallback } from 'react';

import { Button } from '@/components/common/button/button';
import { useAppDispatch } from '@store';
import { blackListActions } from '@store/common/black-list/slice';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { BlackListItemsFilters } from '../black-list-items-filters';

import './black-list-head.scss';
import PlusCircleIcon from '@/assets/icons/plus-circle-icon.svg';

const t = translateByNamespace('common:black-list-page');
const cn = classname('black-list-head');

export const BlackListPageHead = () => {
    const dispatch = useAppDispatch();

    const onAddUserClickHandler = useCallback(() => {
        dispatch(blackListActions.setCreateEditModalProps({ isVisible: true, mode: 'create', blackListPublicId: null }));
    }, [dispatch]);

    return (
        <div className={cn('')}>
            <span>{t('header')}</span>
            <Button view='primary' size='medium' onClick={onAddUserClickHandler}>
                <PlusCircleIcon /> {t('header-add-company-btn')}
            </Button>
            <BlackListItemsFilters />
        </div>
    );
};
