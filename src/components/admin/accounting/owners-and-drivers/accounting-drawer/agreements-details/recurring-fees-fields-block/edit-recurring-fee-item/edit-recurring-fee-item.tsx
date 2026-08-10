import React from 'react';
import { Field } from 'react-final-form';

import { IconButton } from '@/components/common/icon-button/icon-button';
import { FeeCategoryType } from '@/enums/fee/fee-category-types-enum';
import { FeePeriod } from '@/enums/fee/fee-periods-enum';
import { isNumber } from '@/shared';
import {CurrencyPercentageField} from '@/fields/currency-percentage-field';
import {FormControl} from '@/fields/form-control';
import {FormHelperText} from '@/fields/form-helper-text';
import {InputLabel} from '@/fields/input-label';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { formatToCurrency } from '@utils/numbers';
import { required } from '@validators';

import { FeeIntervalTypeSelect } from './fee-interval-type-select/fee-interval-type-select';
import { EditRecurringFeeItemProps } from './edit-recurring-fee-item.types';
import { FeePeriodsSelect } from './fee-periods-select';
import { FeeRecurringCategorySelect } from './fee-recurring-category-select';
import { FeeRecurringLimitField } from './fee-recurring-limit-field';
import { FeeRecurringMonthDaysSelect } from './fee-recurring-month-days-select';
import { FeeRecurringWeekDaysSelect } from './fee-recurring-week-days-select';
import { useEditRecurringFeeItem } from './use-edit-recurring-fee-item';

import './edit-recurring-fee-item.scss';
import TrashIcon from '@/assets/icons/trash-can.svg';

const cn = classname('edit-recurring-fee-item');
const t = translateByNamespace('admin:accounting:carrier-accounting-drawer');

export const EditRecurringFeeItem = ({ disabled = false, prefix, handleRemove }: EditRecurringFeeItemProps) => {
    const {
        handleChangedTotalClick,
        handleRecurringCategoryChange,
        selectedFeeCategory,
        handleRecurringFeePeriodChange,
        selectedFeePeriod,
        chargedTotal,
        limit,
    } = useEditRecurringFeeItem({
        prefix,
    });
    const isSelectedWeeklyPeriod = selectedFeePeriod === FeePeriod.WEEKLY;
    const isIntervalFeeType = selectedFeeCategory?.type === FeeCategoryType.ORDER_INTERVAL_RECURRING;

    return (
        <div className={cn('')}>
            <div className={cn('', { row: true })}>
                <FormControl>
                    <InputLabel required={true}>{t('fee-category')}</InputLabel>
                    <Field
                        name={`${prefix}.feeCategoryId`}
                        className={cn('category')}
                        component={FeeRecurringCategorySelect}
                        validate={required}
                        placeholder=''
                        callback={handleRecurringCategoryChange}
                        isClearable={false}
                        menuPlacement='auto'
                        disabled={disabled}
                    />
                </FormControl>
                {isIntervalFeeType && (
                    <FormControl>
                        <InputLabel required={true}>{t('period')}</InputLabel>
                        <Field
                            name={`${prefix}.intervalType`}
                            component={FeeIntervalTypeSelect}
                            validate={required}
                            placeholder=''
                            isClearable={false}
                            menuPlacement='auto'
                            className={cn('period')}
                            disabled={disabled}
                        />
                    </FormControl>
                )}
                {!isIntervalFeeType && (
                    <>
                        <FormControl>
                            <InputLabel required={true}>{t('period')}</InputLabel>
                            <Field
                                name={`${prefix}.period`}
                                component={FeePeriodsSelect}
                                validate={required}
                                placeholder=''
                                callback={handleRecurringFeePeriodChange}
                                isClearable={false}
                                menuPlacement='auto'
                                className={cn('period')}
                                disabled={disabled}
                            />
                        </FormControl>
                        <FormControl>
                            <InputLabel required={true}>{t('day')}</InputLabel>
                            <Field
                                name={isSelectedWeeklyPeriod ? `${prefix}.recurringWeekDay` : `${prefix}.recurringMonthDay`}
                                component={isSelectedWeeklyPeriod ? FeeRecurringWeekDaysSelect : FeeRecurringMonthDaysSelect}
                                validate={required}
                                placeholder=''
                                isClearable={false}
                                menuPlacement='auto'
                                className={cn('day')}
                                disabled={disabled}
                            />
                        </FormControl>
                    </>
                )}

                <FormControl className={cn('amount')}>
                    <InputLabel required={true}>{t('amount')}</InputLabel>
                    <CurrencyPercentageField
                        prefix={prefix}
                        fieldName='value'
                        selectedValue={selectedFeeCategory}
                        hideSelectionIndicator={true}
                        disabled={disabled}
                    />
                </FormControl>
                <FormControl className={cn('limit')}>
                    <InputLabel>{t('limit')}</InputLabel>
                    <FeeRecurringLimitField prefix={prefix} name='limit' disabled={disabled} defaultValue={selectedFeeCategory?.defaultLimit} />
                </FormControl>
                {!disabled && <IconButton onClick={handleRemove} Icon={TrashIcon} />}
            </div>
            {isNumber(chargedTotal) && isNumber(limit) && (
                <FormHelperText className={cn('changed-total', { success: chargedTotal === Number(limit) })}>
                    <span onClick={handleChangedTotalClick}>{t('charged-total-text', { value: formatToCurrency(chargedTotal) })}</span>
                </FormHelperText>
            )}
        </div>
    );
};
