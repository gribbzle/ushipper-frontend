import React from 'react';
import { Field } from 'react-final-form';

import { IconButton } from '@/components/common/icon-button/icon-button';
import {CurrencyPercentageField} from '@/fields/currency-percentage-field';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { required } from '@validators';

import { FeeCategorySelect } from './fee-category-select/fee-category-select';
import { EditFeeItemProps } from './edit-fee-item.types';
import { useEditFeeItem } from './use-edit-fee-item';

import './edit-fee-item.scss';
import TrashIcon from '@/assets/icons/trash-can.svg';

const cn = classname('edit-fee-item');
const t = translateByNamespace('admin:accounting:carrier-accounting-drawer');

export const EditFeeItem = ({ prefix, valueFieldName, disabled = false, handleRemove }: EditFeeItemProps) => {
    const { handleCategoryChange, selectedFeeCategory } = useEditFeeItem();

    return (
        <div className={cn()}>
            <FormControl>
                <InputLabel required={true}>{t('fee-category')}</InputLabel>
                <Field
                    name={prefix ? `${prefix}.feeCategoryId` : 'feeCategoryId'}
                    className={cn('category')}
                    component={FeeCategorySelect}
                    validate={required}
                    placeholder=''
                    callback={handleCategoryChange}
                    isClearable={false}
                    hideRecurringOption={true}
                    disabled={disabled}
                />
            </FormControl>
            <FormControl>
                <InputLabel required={true}>{t('amount')}</InputLabel>
                <CurrencyPercentageField prefix={prefix} fieldName={valueFieldName} selectedValue={selectedFeeCategory} disabled={disabled} />
            </FormControl>
            {!disabled && <IconButton onClick={handleRemove} Icon={TrashIcon} />}
        </div>
    );
};
