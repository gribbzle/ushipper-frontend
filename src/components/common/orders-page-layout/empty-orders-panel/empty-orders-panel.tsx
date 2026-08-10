import React from 'react';

import { Button } from '@/components/common/button/button';
import { Link } from '@/components/common/link/link';
import { Paper } from '@/components/common/paper/paper';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './empty-orders-panel.scss';
import ExternalLinkIcon from '@/assets/icons/external-link.svg';

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
