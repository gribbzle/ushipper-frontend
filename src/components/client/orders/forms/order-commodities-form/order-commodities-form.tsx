import React from 'react';
import { FieldArray } from 'react-final-form-arrays';

import { AlertBlock } from '@/components/common/alert-block/alert-block';
import { useDisableProductChanging } from '@/hooks/order/use-disable-product-changing';
import {InputLabel} from '@/fields/input-label';
import { useMeShipper } from '@hooks';
import { OrderFieldsGroup } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { translateCompanyType } from '@utils/translations';

import { CommodityRow } from './commodity-row';

import './order-commodities-form.scss';

const t = translateByNamespace('client:order:commodities');
const tFields = translateByNamespace('client:order:commodities:fields');

const cn = classname('order-commodities-form');

type Props = {
    handleCommodityDelete: (index: number) => void;
};

export const OrderCommoditiesForm = ({ handleCommodityDelete }: Props) => {
    const isMeShipper = useMeShipper();
    const isDisabled = useDisableProductChanging();

    return (
        <div className={cn()}>
            <div className={cn('header')}>
                <InputLabel>{tFields('description-label')}</InputLabel>
                <InputLabel>{tFields('qty-label')}</InputLabel>
                <InputLabel>{tFields('type-label')}</InputLabel>
                <InputLabel>{tFields('weight-label')}</InputLabel>
                <InputLabel>{tFields('pcs-label')}</InputLabel>
                <InputLabel>{tFields('length-label')}</InputLabel>
                <InputLabel>{tFields('width-label')}</InputLabel>
                <InputLabel>{tFields('height-label')}</InputLabel>
                <InputLabel>{tFields('class-label')}</InputLabel>
            </div>
            <FieldArray name={OrderFieldsGroup.COMMODITIES}>
                {({ fields }) =>
                    fields.map((name, index) => (
                        <CommodityRow className={cn('row')} key={index} index={index} name={name} onDelete={() => handleCommodityDelete(index)} />
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
