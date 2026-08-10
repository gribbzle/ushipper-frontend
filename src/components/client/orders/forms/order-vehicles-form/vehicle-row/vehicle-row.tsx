import React, { useMemo } from 'react';
import { useForm } from 'react-final-form';

import { IconButton } from '@/components/common/icon-button/icon-button';
import { Tooltip } from '@/components/common/tooltip/tooltip';
import { TooltipContent } from '@/components/common/tooltip/tooltip';
import { TooltipTrigger } from '@/components/common/tooltip/tooltip';
import { VehicleMakerInput } from '@/components/common/vehicle-maker-input/vehicle-maker-input';
import { VehicleModelInput } from '@/components/common/vehicle-model-input/vehicle-model-input';
import { VehicleTypesSelect } from '@/components/common/vehicle-types-select/vehicle-types-select';
import { VehicleVinInput } from '@/components/common/vehicle-vin-input/vehicle-vin-input';
import { useDisableProductChanging } from '@/hooks/order/use-disable-product-changing';
import {CheckboxInput} from '@/fields/checkbox-input';
import {FieldPrefix, PrefixedField} from '@/fields/field-prefix';
import {FormControl} from '@/fields/form-control';
import {TextField} from '@/fields/text-field';
import { TrashIcon } from '@icons';
import { useGetOrderVehicleInspectionsQuery } from '@store/api/order-vehicle-api';
import { OrderFormState } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { required } from '@validators';

import './vehicle-row.scss';

const cn = classname('vehicle-row');
const tPlaceholder = translateByNamespace('client:order:fields');
const t = translateByNamespace('client:order:vehicles:fields');

type Props = {
    className?: string;
    name: string;
    onDelete: () => void;
    index: number;
};

const validateRow = (index: number, value: any, allValues: OrderFormState) => {
    const currentRow = allValues.expenses ? allValues.expenses[index] : undefined;

    if (currentRow) {
        const filledField = Object.values(currentRow).find(val => !!val);

        if (filledField) {
            return required(value);
        }
    }

    return undefined;
};

export const VehicleRow = ({ className, name, onDelete, index }: Props) => {
    const isDisabled = useDisableProductChanging();
    const form = useForm();
    const { publicId, vehicles } = form.getState().values;

    const { data: inspections } = useGetOrderVehicleInspectionsQuery(
        { orderId: publicId, vehicleId: vehicles[index].id },
        { skip: !(publicId && vehicles[index].id) },
    );

    const isDisabledDeleteBtn = useMemo(() => !!inspections?.delivery || !!inspections?.pickup, [inspections]);

    return (
        <div className={cn('', [className])}>
            <FieldPrefix prefix={name}>
                <FormControl>
                    <PrefixedField disabled={isDisabled} name='vin' component={VehicleVinInput} prefixed={true} placeholder={tPlaceholder('no-placeholder')} />
                </FormControl>
                <PrefixedField disabled={isDisabled} name='year' component={TextField} placeholder={tPlaceholder('no-placeholder')} type='number' />
                <PrefixedField disabled={isDisabled} name='make' component={VehicleMakerInput} placeholder={tPlaceholder('no-placeholder')} />
                <PrefixedField disabled={isDisabled} name='model' component={VehicleModelInput} placeholder={tPlaceholder('no-placeholder')} />
                <FormControl>
                    <PrefixedField
                        disabled={isDisabled}
                        name='type'
                        component={VehicleTypesSelect}
                        validate={(value, allValues) => {
                            return validateRow(index, value, allValues);
                        }}
                        parse={value => value}
                        isClearable={false}
                    />
                </FormControl>
                <PrefixedField disabled={isDisabled} name='color' component={TextField} placeholder={tPlaceholder('no-placeholder')} />
                <PrefixedField disabled={isDisabled} name='lotNumber' component={TextField} placeholder={tPlaceholder('no-placeholder')} />
                <PrefixedField disabled={isDisabled} name='price' component={TextField} placeholder={tPlaceholder('no-placeholder')} />
                <PrefixedField disabled={isDisabled} name='inop' component={CheckboxInput} />
                <PrefixedField disabled={isDisabled} name='enclosed' component={CheckboxInput} />
            </FieldPrefix>
            {!isDisabled && (
                <Tooltip>
                    <TooltipTrigger asChild={true}>
                        <div className={cn('tip-icon')}>
                            <IconButton Icon={TrashIcon} onClick={onDelete} disabled={isDisabledDeleteBtn} />
                        </div>
                    </TooltipTrigger>
                    {isDisabledDeleteBtn && <TooltipContent className={cn('tip')}>{t('no-delete-tip')}</TooltipContent>}
                </Tooltip>
            )}
        </div>
    );
};
