import React from 'react';

import { classname } from '@utils/classname';

import './order-payment-information-fields-wrapper.scss';

const cn = classname('order-payment-information-fields-wrapper');

interface Props extends React.PropsWithChildren {
    title?: string;
}

export const OrderPaymentInformationFieldsWrapper = ({ title, children }: Props) => {
    return (
        <div className={cn()}>
            {title && <div className={cn('title')}>{title}</div>}
            <div className={cn('row')}>{children}</div>
        </div>
    );
};
