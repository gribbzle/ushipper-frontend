import React from 'react';

import { Button } from '@/components';
import { CheckIcon } from '@icons';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('client:order');

type Props = {
    form:
        | 'orderCustomerInformationForm'
        | 'orderDeliveryInformationForm'
        | 'orderPaymentInformationForm'
        | 'orderPickupInformationForm'
        | 'orderMarkAsPaidForm'
        | 'orderVehicleForm'
        | 'orderDriverInstructionsForm'
        | 'orderDetailsForm';
};

export const OrderDrawerSubmitBtn = ({ form }: Props) => (
    <Button type='submit' form={form} view='primary'>
        <CheckIcon /> {t('drawer-submit-btn-label')}
    </Button>
);
