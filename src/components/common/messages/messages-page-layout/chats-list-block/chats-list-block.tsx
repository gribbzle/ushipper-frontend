import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

import { ChatsSearch } from '@/components/common/chats-drawer/chats-search/chats-search';
import { EmptyChatsList } from '@/components/common/chats-drawer/empty-chats-list/empty-chats-list';
import { Loader } from '@/components/common/loader/loader';
import { ChatTypesEnum } from '@/enums';
import { useDebouncedGetChats, useMeAdmin, useMeDriverRelated } from '@hooks';
import { useAppDispatch, useAppSelector } from '@store';
import {
    chatsSearchTextSelector,
    drawerChatsSelector,
    driverSupportChatSelector,
    getChatsRequestSelector,
    getSupportChatRequestSelector,
    messagesActions,
} from '@store/client';
import { ChatsDrawerSliceState } from '@store/common/chats/types';
import { MessagesSliceState } from '@store/common/messages/types';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { RequestStatus } from '@utils/redux';

import { SupportChat } from './driver-support-chat/driver-support-chat';
import { ChatListBlockItem } from './chats-list-block-item';

import './chats-list-block.scss';

const NEED_TO_RESET_CHATS = true;

const cn = classname('chats-list-block');
const t = translateByNamespace('common:chats');

export const ChatsListBlock = () => {
    const searchTextRef = useRef<string>();
    const chatsContainerRef = useRef<HTMLDivElement | null>(null);
    const getChatsRequest = useAppSelector(getChatsRequestSelector);
    const getChatsRequestRef = useRef<ChatsDrawerSliceState['getChatsRequest']>();
    const chats = useAppSelector(drawerChatsSelector);
    const searchText = useAppSelector(chatsSearchTextSelector);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const params = useSearchParams();
    const isMeAdmin = useMeAdmin();
    const isDriver = useMeDriverRelated();

    const driverSupportChat = useAppSelector(driverSupportChatSelector);

    const getSupportChatRequest = useAppSelector(getSupportChatRequestSelector);
    const getSupportChatChatRequestRef = useRef<MessagesSliceState['getSupportChatRequest']>();

    useEffect(() => {
        getSupportChatChatRequestRef.current = getSupportChatRequest;
    }, [getSupportChatRequest]);

    const getChatsDebounced = useDebouncedGetChats();

    useEffect(() => {
        const searchParam = params.get('search') || '';

        dispatch(messagesActions.setChatsSearchText(searchParam));
    }, [dispatch, params]);

    const onScrollHandler = useCallback(
        (event: Event) => {
            const target = event.target as HTMLDivElement;

            if (!(target instanceof HTMLDivElement)) {
                return;
            }

            const getChatsRequest = getChatsRequestRef.current;

            const isListScrolledToBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 100;
            const isNextRequestAvailable = getChatsRequest?.status === RequestStatus.NONE || getChatsRequest?.nextCursor;

            if (isListScrolledToBottom && isNextRequestAvailable) {
                getChatsDebounced(searchTextRef.current);
            }
        },
        [getChatsDebounced],
    );

    useEffect(() => {
        const chatsContainer = chatsContainerRef.current;

        if (!chatsContainer) {
            return;
        }

        chatsContainer.addEventListener('scroll', onScrollHandler);

        return () => chatsContainer.removeEventListener('scroll', onScrollHandler);
    }, [dispatch, onScrollHandler]);

    useEffect(() => {
        getChatsRequestRef.current = getChatsRequest;
        searchTextRef.current = searchText;
    }, [getChatsRequest, searchText]);

    useEffect(() => {
        if (!isDriver) {
            getChatsDebounced(searchText, !!searchText || NEED_TO_RESET_CHATS);
        }
    }, [getChatsDebounced, searchText, isDriver]);

    useEffect(() => {
        const getSupportChatRequest = getSupportChatChatRequestRef?.current;

        if (isDriver && getSupportChatRequest?.status === RequestStatus.SUCCESS) {
            getChatsDebounced(searchText, !!searchText || NEED_TO_RESET_CHATS);
        }
    }, [getChatsDebounced, searchText, isDriver, getSupportChatRequest]);

    const chatsSearchHandler = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const newSearchText = event.target.value;

            dispatch(messagesActions.setChatsSearchText(newSearchText));

            router.replace(
                {
                    pathname: router.pathname,
                    query: newSearchText ? { search: newSearchText } : {},
                },
                undefined,
                { shallow: true },
            );
        },
        [dispatch, router],
    );

    const clearSearchHandler = useCallback(() => {
        dispatch(messagesActions.setChatsSearchText(''));

        router.replace(
            {
                pathname: router.pathname,
                query: {},
            },
            undefined,
            { shallow: true },
        );
    }, [dispatch, router]);

    const filteredChats = useMemo(() => {
        if (isDriver) {
            return chats.filter(chat => chat.type !== ChatTypesEnum.SUPPORT);
        }

        return chats;
    }, [chats, isDriver]);

    const showLoader = useMemo(() => {
        const checkedStatuses = [RequestStatus.PROCESSING, RequestStatus.NONE];

        return checkedStatuses.includes(getChatsRequest.status);
    }, [getChatsRequest.status]);

    const showSearchEmptyList = useMemo(
        () => !showLoader && searchText && (!chats.length || (isDriver && chats.length === 0)),
        [showLoader, searchText, isDriver, chats.length],
    );

    return (
        <div className={cn()}>
            <ChatsSearch
                searchText={searchText}
                onClose={clearSearchHandler}
                onChange={chatsSearchHandler}
                placeholder={isMeAdmin ? t('admin-support-chats-list-search-placeholder') : undefined}
            />
            {isDriver && <SupportChat />}
            <div className={cn('list', { 'with-support': isDriver })} ref={chatsContainerRef}>
                {showSearchEmptyList && <EmptyChatsList isSearch={true} />}
                {filteredChats.map(chat => {
                    return <ChatListBlockItem key={chat.publicId} chat={chat} />;
                })}
                {!searchText && !chats.length && !showLoader && !driverSupportChat && <EmptyChatsList />}
                {showLoader && (
                    <div className={cn('loader')}>
                        <Loader />
                    </div>
                )}
            </div>
        </div>
    );
};
