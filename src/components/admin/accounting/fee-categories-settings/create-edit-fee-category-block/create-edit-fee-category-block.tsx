import React from 'react';
import { Field, Form } from 'react-final-form';

import { Button } from '@/components/common/button/button';
import { FeeCategoryTypesSelect } from '@/components/common/selects/fee-category-types-select/fee-category-types-select';
import { Paper } from '@/components/common/paper/paper';
import { FeeCategoryType } from '@/enums';
import { CurrencyPercentageField, FormControl, InputLabel, TextField } from '@fields';
import { classname } from '@utils/classname';
import { FormValuesSpy } from '@utils/form';
import { translateByNamespace } from '@utils/i18n';
import { required } from '@validators';

import { WalletsSelect } from '../../common';

import { CreateEditFeeCategoryFormState } from './create-edit-fee-category-block.types';
import { useCreateEditFeeCategoryBlock } from './use-create-edit-fee-category-block';

import './create-edit-fee-category-block.scss';

const t = translateByNamespace('admin:accounting:fee-categories-settings:create-edit-fee-category-block');
const tAction = translateByNamespace('common:create-update-role-block.form');

const cn = classname('create-edit-fee-category-block');

export const CreateEditFeeCategoryBlock = () => {
    const { formRef, initialValues, selectedFeeCategory, isEditMode, onSubmit, onChangeHandler } = useCreateEditFeeCategoryBlock();

    return (
        <Paper
            className={cn()}
            title={t('title', { name: selectedFeeCategory?.name ?? t('new-fee-category') })}
            body={
                <Form<CreateEditFeeCategoryFormState>
                    onSubmit={onSubmit}
                    initialValues={initialValues}
                    render={({ handleSubmit, form }) => {
                        formRef.current = form;
                        const { getState } = form;
                        const isDirty = getState().dirty;
                        const { type } = getState().values;
                        const isRecurring = [FeeCategoryType.RECURRING, FeeCategoryType.ORDER_INTERVAL_RECURRING].includes(type);
                        const isCustomFee = type === FeeCategoryType.TO_WALLET;

                        return (
                            <form onSubmit={handleSubmit} className={cn('form')}>
                                <FormValuesSpy onChange={onChangeHandler} debounceTime={300} />
                                <FormControl>
                                    <InputLabel required={true}>{t('name-field-label')}</InputLabel>
                                    <Field name='name' component={TextField} validate={required} placeholder='' />
                                </FormControl>
                                <FormControl>
                                    <InputLabel required={true}>{t('type-field-label')}</InputLabel>
                                    <Field name='type' component={FeeCategoryTypesSelect} validate={required} placeholder='' />
                                </FormControl>
                                <FormControl>
                                    <InputLabel required={true}>{t('wallet-field-label')}</InputLabel>
                                    <Field
                                        name='balanceId'
                                        component={WalletsSelect}
                                        onlyCustomInternalWallets={true}
                                        showSelectedWalletDetails={false}
                                        isClearable={false}
                                        parse={value => value}
                                        placeholder=''
                                        validate={required}
                                        disabled={!isCustomFee}
                                    />
                                </FormControl>
                                <div className={cn('row')}>
                                    <FormControl className={cn('default-value', { fixed: isRecurring })}>
                                        <InputLabel required={true}>{t('default-amount-field-label')}</InputLabel>
                                        <CurrencyPercentageField fieldName='defaultValue' hideSelectionIndicator={isRecurring} />
                                    </FormControl>
                                    {isRecurring && (
                                        <FormControl className={cn('default-limit')}>
                                            <InputLabel>{t('default-limit-field-label')}</InputLabel>
                                            <CurrencyPercentageField fieldName='defaultLimit' hideSelectionIndicator={true} isRequiredCurrency={false} />
                                        </FormControl>
                                    )}
                                </div>
                                <Button view='primary' type='submit' className={cn('action')} disabled={!isDirty}>
                                    {tAction(`${isEditMode ? 'save' : 'add'}-settings-button-label`)}
                                </Button>
                            </form>
                        );
                    }}
                />
            }
        />
    );
};
