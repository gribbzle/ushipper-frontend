import React from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { Button } from '@/components/common';
import { LinkIcon, PrinterIcon } from '@icons';
import { classname, translateByNamespace } from '@utils';

import './order-BOL-header-buttons.scss';

const cn = classname('order-BOL-header-buttons');
const t = translateByNamespace('client:order-BOL-page');

export const OrderBOLHeaderButtons = () => {
    const { asPath } = useRouter();

    const handleCopyLink = () => {
        navigator.clipboard.writeText(`${window.location.origin}${asPath}`);
        toast.success(t<string>('header-button-copy'));
    };

    const handlePrintPage = () => {
        window.print();
    };

    return (
        <div className={cn()}>
            <Button view='primary' size='medium' onClick={handleCopyLink}>
                <LinkIcon />
                <span className={cn('text')} data-title={t('header-button-copy-title')} data-short-title={t('header-button-copy-short-title')}></span>
            </Button>
            <Button view='default' size='medium' onClick={handlePrintPage}>
                <PrinterIcon />
                <span className={cn('text')} data-title={t('header-button-print-title')} data-short-title={t('header-button-print-short-title')} />
            </Button>
        </div>
    );
};
