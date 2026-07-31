import React from 'react';

import { Button } from '@/components/common/button/button';
import { CheckIcon } from '@icons';
import { translateByNamespace } from '@utils/i18n';

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
