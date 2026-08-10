import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { useDebouncedGetChats } from '@/hooks/chat/use-debounced-get-chats';
import { useAppDispatch, useAppSelector } from '@store';
import { drawerChatsSelector, getChatsRequestSelector, isChatsDrawerOpenSelector, selectedChatIdSelector } from '@store/common';
import { ChatsDrawerSliceState } from '@store/common/chats/types';
import { classname } from '@utils/classname';
import { RequestStatus } from '@utils/redux';

import { ChatsSearch } from '../chats-search';
import { EmptyChatsList } from '../empty-chats-list';

import { ChatListItem } from './chat-list-item';

import './chats-list.scss';

const cn = classname('chats-list');

export const ChatsList = () => {
    const dispatch = useAppDispatch();
    const chatsContainerRef = useRef<HTMLDivElement | null>(null);
    const chats = useSelector(drawerChatsSelector);
    const getChatsRequest = useSelector(getChatsRequestSelector);
    const getChatsRequestRef = useRef<ChatsDrawerSliceState['getChatsRequest']>();
    const { isDrawerOpen, needToReset, setSelectedAtTop } = useAppSelector(isChatsDrawerOpenSelector);
    const selectedChatId = useAppSelector(selectedChatIdSelector);

    const getChatsDebounced = useDebouncedGetChats();

    const [searchText, setSearchText] = useState<string>();
    const searchTextRef = useRef<string>();

    useEffect(() => {
        if (isDrawerOpen) {
            getChatsDebounced(searchText, !!searchText || needToReset);
        } else {
            setSearchText('');
        }
    }, [getChatsDebounced, searchText, isDrawerOpen, needToReset]);

    useEffect(() => {
        getChatsRequestRef.current = getChatsRequest;
        searchTextRef.current = searchText;
    }, [getChatsRequest, searchText]);

    const onScrollHandler = useCallback(
        (event: Event) => {
            const target = event.target;

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

        if (!chatsContainer || !isDrawerOpen) {
            return;
        }

        chatsContainer.addEventListener('scroll', onScrollHandler);

        return () => chatsContainer.removeEventListener('scroll', onScrollHandler);
    }, [dispatch, getChatsDebounced, isDrawerOpen, onScrollHandler]);

    const chatsToRender = useMemo(() => {
        if (setSelectedAtTop && selectedChatId) {
            const cloneChats = [...chats];
            const selectedChatIndex = cloneChats.findIndex(({ publicId }) => publicId === selectedChatId);

            const selectedChat = cloneChats.splice(selectedChatIndex, 1);

            return [...selectedChat, ...cloneChats];
        }

        return chats;
    }, [chats, setSelectedAtTop, selectedChatId]);

    return (
        <div className={cn()}>
            <ChatsSearch searchText={searchText} onClose={() => setSearchText('')} onChange={event => setSearchText(event.target.value)} />
            <div className={cn('list')} ref={chatsContainerRef}>
                {searchText && !chats.length && <EmptyChatsList isSearch={true} />}
                {chatsToRender.map(chat => {
                    return <ChatListItem key={chat.publicId} chat={chat} />;
                })}
                {!searchText && !chats.length && <EmptyChatsList />}
            </div>
        </div>
    );
};
