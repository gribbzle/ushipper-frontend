import React, { ChangeEvent } from 'react';

import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { Input } from '../../input';

import './chats-search.scss';
import CloseIcon from '@/assets/icons/close-icon.svg';
import SearchIcon from '@/assets/icons/search.svg';

type ChatsSearchProps = {
    searchText?: string;
    placeholder?: string;
    onClose: () => void;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const cn = classname('chats-search');
const t = translateByNamespace('common:chats');

export const ChatsSearch = ({ onClose, onChange, searchText = '', placeholder }: ChatsSearchProps) => (
    <div className={cn('')}>
        <Input
            inputSize='default'
            view='secondary'
            placeholder={placeholder ?? t('chats-list-search-placeholder')}
            endAdornment={
                <div className={cn('end-adornment')}>
                    <SearchIcon className={cn('search-icon')} />
                    {!!searchText && <CloseIcon onClick={onClose} className={cn('close-icon')} />}
                </div>
            }
            value={searchText}
            onChange={onChange}
        />
    </div>
);
