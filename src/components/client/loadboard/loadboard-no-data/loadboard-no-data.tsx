import React from 'react';

import RefreshIcon from '@/assets/icons/refresh.svg';
import { Button, Paper } from '@components';
import { classname, renderTextWithBreakLines, translateByNamespace } from '@utils';

import './loadboard-no-data.scss';

type Props = {
    emptyText: string;
    isRefetchButtonShown: boolean;
    onFiltersRefresh: () => void;
};

const cn = classname('loadboard-no-data');
const t = translateByNamespace('client:loadboard:no-data');

export const LoadboardNoData = (props: Props) => {
    const content = (isRefetchButtonShown: boolean) => {
        if (isRefetchButtonShown) {
            return (
                <>
                    {renderTextWithBreakLines(props.emptyText)}
                    <Button view='primary' plain={true} className={cn('reset')} onClick={props.onFiltersRefresh}>
                        <RefreshIcon />
                        {t('clear-filters')}
                    </Button>
                </>
            );
        } else {
            return renderTextWithBreakLines(props.emptyText);
        }
    };

    return (
        <Paper
            className={cn()}
            body={
                <div className={cn('body')}>
                    <div className={cn('content')}>{content(props.isRefetchButtonShown)}</div>
                </div>
            }
        />
    );
};
