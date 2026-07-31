import React, { ReactNode, useCallback } from 'react';

import { classname } from '@utils/classname';

import './list.scss';

const SCROLL_THRESHOLD = 3;

const cn = classname('list');

type ListProps<ItemT> = {
    className?: string;
    data: ItemT[] | null | undefined;
    renderItem: ({ item, index }: { item: ItemT; index: number }) => ReactNode;
    ListEmptyComponent?: JSX.Element;
    onEndReached?: () => void;
};

export const List: <ItemT = Record<string, any>>(props: ListProps<ItemT>) => React.ReactElement = ({
    className,
    data,
    renderItem,
    ListEmptyComponent,
    onEndReached,
}: ListProps<any>) => {
    const handleScroll = useCallback(
        (e: React.UIEvent<HTMLDivElement>): void => {
            const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
            const isBottom = scrollHeight - scrollTop <= clientHeight + SCROLL_THRESHOLD;

            if (isBottom) {
                onEndReached?.();
            }
        },
        [onEndReached],
    );

    return (
        <div className={cn('', [className])} onScroll={handleScroll}>
            {data?.map((item, index) => renderItem({ item, index }))}
            {(!data || data.length === 0) && ListEmptyComponent}
        </div>
    );
};
