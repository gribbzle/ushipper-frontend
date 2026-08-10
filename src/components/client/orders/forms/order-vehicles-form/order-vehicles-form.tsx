import React from 'react';
import { FieldArray } from 'react-final-form-arrays';

import { AlertBlock } from '@/components/common/alert-block/alert-block';
import { useDisableProductChanging } from '@/hooks/order/use-disable-product-changing';
import {InputLabel} from '@/fields/input-label';
import { useMeShipper } from '@/hooks/use-user-role-group';
import { OrderFieldsGroup } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { translateCompanyType } from '@utils/translations';

import { VehicleRow } from './vehicle-row';

import './order-vehicles-form.scss';

const t = translateByNamespace('client:order:vehicles');
const cn = classname('order-vehicles-form');

type Props = {
    handleVehicleDelete: (index: number) => void;
};

export const OrderVehiclesForm = ({ handleVehicleDelete }: Props) => {
    const isMeShipper = useMeShipper();
    const isDisabled = useDisableProductChanging();

    return (
        <div className={cn()}>
            <div className={cn('header')}>
                <InputLabel>{t('fields:vin-label')}</InputLabel>
                <InputLabel>{t('fields:year-label')}</InputLabel>
                <InputLabel>{t('fields:make-label')}</InputLabel>
                <InputLabel>{t('fields:model-label')}</InputLabel>
                <InputLabel required={true}>{t('fields:type-label')}</InputLabel>
                <InputLabel>{t('fields:color-label')}</InputLabel>
                <InputLabel>{t('fields:lot-number-label')}</InputLabel>
                <InputLabel>{t('fields:price-label')}</InputLabel>
                <InputLabel>{t('fields:inop-label')}</InputLabel>
                <InputLabel>{t('fields:enclosed-label')}</InputLabel>
            </div>
            <FieldArray name={OrderFieldsGroup.VEHICLES}>
                {({ fields }) =>
                    fields.map((name, index) => (
                        <VehicleRow className={cn('row')} index={index} key={index} name={name} onDelete={() => handleVehicleDelete(index)} />
                    ))
                }
            </FieldArray>
            {isDisabled && (
                <AlertBlock>
                    {isMeShipper
                        ? t('alert-block-text-shipper', { user: translateCompanyType('carrier') })
                        : t('alert-block-text-carrier', { user: translateCompanyType('shipper') })}
                </AlertBlock>
            )}
        </div>
    );
};
