import React, { useContext } from 'react';

import { useRedirectToOrder } from '@/hooks/order';
import { useOnBack } from '@/hooks/useOnBack';
import { classname } from '@utils/classname';

import { RouterContext } from '../router-provider';

import './back-link.scss';
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg';

type Props = {
    className?: string;
    customBackHandler?: () => void;
    label?: string;
};

const cn = classname('back-link');

export const BackLink = ({ className, customBackHandler, label }: Props) => {
    const { prevRouter } = useContext(RouterContext);
    const { redirectToOrders } = useRedirectToOrder({});
    const goBack = useOnBack();

    const onBackHandler = async () => {
        if (prevRouter && !prevRouter.pathname.includes('create')) {
            await goBack();
        } else {
            await redirectToOrders();
        }
    };

    return (
        <div onClick={customBackHandler || onBackHandler} className={cn('', [className])}>
            <ArrowLeftIcon className={cn('back-icon')} />
            {label}
        </div>
    );
};
