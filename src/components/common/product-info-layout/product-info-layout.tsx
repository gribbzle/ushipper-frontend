import React from 'react';
import Image from 'next/image';

import { Link } from '@/components';
import { Rectangle68, Rectangle69 } from '@images';
import logos from '@logo';
import { classname, translateByNamespace } from '@utils';

import './product-info-layout.scss';

const t = translateByNamespace('common:product-info-layout');
const cn = classname('product-info-layout');

type Props = {
    children: React.ReactNode;
};
const { LogoWhiteDefaultAll } = logos;

export const ProductInfoLayout = (props: Props) => {
    const { children } = props;

    return (
        <div className={cn()}>
            <div className={cn('form')}>{children}</div>
            <div className={cn('info')}>
                <div className={cn('geometry-1')}>
                    <Rectangle68 />
                </div>
                <div className={cn('geometry-2')}>
                    <Rectangle69 />
                </div>
                <div className={cn('content')}>
                    <LogoWhiteDefaultAll />
                    <div className={cn('preview-wrapper')}>
                        <Image src='/sign-in-background.png' alt='background' fill={true} />
                    </div>
                    <div className={cn('caption')}>
                        <h1>{t('header')}</h1>
                        <h4>{t('description')}</h4>
                    </div>
                </div>
                <div className={cn('links')}>
                    <Link href='/'>{t('terms-link')}</Link>
                    <Link href='/'>{t('plans-link')}</Link>
                    <Link href='/'>{t('contact-us-link')}</Link>
                </div>
            </div>
        </div>
    );
};

export const getProductInfoLayout = (page: React.ReactNode) => <ProductInfoLayout>{page}</ProductInfoLayout>;
