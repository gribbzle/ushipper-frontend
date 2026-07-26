import React from 'react';

import { Button, Link, Paper } from '@components';
import { ExternalLinkIcon } from '@icons';
import { classname, translateByNamespace } from '@utils';

import './empty-orders-panel.scss';

const t = translateByNamespace('client:orders-page');
const cn = classname('empty-orders-panel');

type EmptyOrdersPanelProps = {
    showLink?: boolean;
};

export const EmptyOrdersPanel = ({ showLink = true }: EmptyOrdersPanelProps) => (
    <Paper
        body={
            <div className={cn('')}>
                <span>{t('no-orders-text')}</span>
                {showLink && (
                    <Link href='/client/orders/create'>
                        <Button view='primary'>
                            <ExternalLinkIcon /> {t('add-order-button-label')}
                        </Button>
                    </Link>
                )}
            </div>
        }
    />
);
