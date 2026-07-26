import React, { useCallback, useId, useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';
import Select, {
    ClearIndicatorProps,
    components,
    ControlProps,
    DropdownIndicatorProps,
    MenuListProps,
    MultiValueProps,
    MultiValueRemoveProps,
    OptionProps,
    SingleValueProps,
} from 'react-select';
import AsyncSelect from 'react-select/async';
import { GroupBase, MenuPlacement, MultiValue as MultiValueType, SingleValue } from 'react-select/dist/declarations/src/types';
import { AsyncProps } from 'react-select/dist/declarations/src/useAsync';

import { FormHelperText } from '@/fields';
import { SelectOption } from '@/shared';
import { CSSObject } from '@emotion/serialize';
import { ArrowDownIcon, PlusIcon, TickIcon, XCircleIcon } from '@icons';
import { classname, translateByNamespace } from '@utils';

import './select-field.scss';

const t = translateByNamespace('common:select-input');
const cn = classname('react-select-container');

const DropdownIndicator = (props: DropdownIndicatorProps) => (
    <components.DropdownIndicator {...props}>
        <ArrowDownIcon width={12} height={12} />
    </components.DropdownIndicator>
);

const ClearIndicator = (props: ClearIndicatorProps) => (
    <components.ClearIndicator {...props}>
        <XCircleIcon width={12} height={12} />
    </components.ClearIndicator>
);

const OptionComponent = (props: OptionProps) => {
    const { label, isSelected, isMulti } = props;

    return (
        <components.Option {...props}>
            {isMulti && (isSelected ? <TickIcon width={16} height={16} /> : <PlusIcon width={16} height={16} />)}
            {label}
        </components.Option>
    );
};

const MultiValue = (props: MultiValueProps) => {
    const { index, getValue, selectProps } = props;
    const chipsMaxToShow = (selectProps as any)?.chipsMaxToShow as number | undefined;

    if (!chipsMaxToShow) {
        return <components.MultiValue {...props} />;
    }

    const overflowCount = getValue().length - chipsMaxToShow;

    return index < chipsMaxToShow ? (
        <components.MultiValue {...props} />
    ) : index === chipsMaxToShow ? (
        <components.MultiValue {...props}>+{overflowCount}</components.MultiValue>
    ) : null;
};

const MultiValueRemove = (props: MultiValueRemoveProps) => {
    const { isClearable } = props.selectProps;

    if (!isClearable) {
        return;
    }

    return (
        <components.MultiValueRemove {...props}>
            <XCircleIcon width={12} height={12} />
        </components.MultiValueRemove>
    );
};

const styles = {
    control: (base: CSSObject, { menuIsOpen, isDisabled }: ControlProps) => ({
        ...base,
        backgroundColor: `var(${isDisabled ? '--color-input-background-disabled' : '--color-white'})`,
        boxShadow: 'none',
        minHeight: '40px',
        borderColor: `var(${menuIsOpen ? '--color-primary' : '--color-button-border-default'})`,
        '&:hover': {
            borderColor: `var(${menuIsOpen ? '--color-primary' : '--color-input-border-hover'})`,
        },
        fontSize: '14px',
        cursor: 'pointer',
    }),
    singleValue: (base: CSSObject, { isDisabled }: SingleValueProps) => ({
        ...base,
        color: `var(${isDisabled ? '--color-input-placeholder' : '--color-button-text-default'})`,
    }),
    option: (base: CSSObject, { isDisabled, isSelected }: OptionProps<SelectOption>) => ({
        ...base,
        display: 'flex',
        gap: '8px',
        color: isDisabled ? 'var(--color-input-border-hover)' : `var(${isSelected ? '--color-primary' : '--color-button-text-default'})`,
        fontWeight: isSelected ? 600 : 400,
        lineHeight: '16px',
        fontSize: '14px',
        backgroundColor: 'var(--color-white)',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        padding: '9px 20px',
        '&:hover': {
            backgroundColor: 'var(--color-input-background-disabled)',
        },
        width: 'max-content',
        minWidth: '100%',
    }),
    placeholder: (base: CSSObject) => ({
        ...base,
        overflow: 'hidden',
        whiteSpace: 'nowrap' as const,
        color: 'var(--color-input-placeholder)',
    }),
    valueContainer: (base: CSSObject) => ({
        ...base,
        padding: '2px 12px',
    }),
    multiValue: (base: CSSObject) => ({
        ...base,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        backgroundColor: 'var(--color-tag-background-default)',
        borderColor: 'var(--color-tag-border-default)',
        borderRadius: '4px',
        padding: '4px 8px',
    }),
    multiValueLabel: (base: CSSObject) => ({
        ...base,
        color: 'var(--color-info)',
        fontSize: '14px',
        lineHeight: '16px',
        padding: 0,
        paddingLeft: 0,
    }),
    multiValueRemove: (base: CSSObject) => ({
        ...base,
        padding: 0,
        color: 'var(--color-input-border-hover)',
        '&:hover': {
            color: 'var(--color-info)',
            backgroundColor: 'transparent',
        },
    }),
    menu: (base: CSSObject) => ({
        ...base,
        width: 'max-content',
        minWidth: '100%',
    }),
    menuList: (base: CSSObject, state: MenuListProps<SelectOption>) => ({
        ...base,
        maxHeight: state.selectProps.className?.includes('show-all') ? 'unset' : '300px',
        borderRadius: '4px',
    }),
    dropdownIndicator: (base: CSSObject, state: DropdownIndicatorProps<SelectOption>) => ({
        ...base,
        cursor: 'pointer',
        transition: 'all .2s ease',
        transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : '',
        padding: '0',
    }),
    clearIndicator: (base: CSSObject) => ({
        ...base,
        cursor: 'pointer',
        padding: '0',
    }),
    indicatorsContainer: (base: CSSObject) => ({
        ...base,
        padding: '0 12px',
        gap: '6px',
    }),
};

export type SelectFieldProps<T = string> = FieldRenderProps<T> & {
    isClearable?: boolean;
    isMulti?: boolean;
    closeMenuOnSelect?: boolean;
    hideSelectedOptions?: boolean;
    onInputChange?: (newValue: string) => void;
    isLoading?: boolean;
    className?: string;
    disabled?: boolean;
    displayAllOptions?: boolean;
    classNames?: Record<string, () => string>;
    loadOptions?: (s: string, cb: (options: SelectOption[]) => any) => any;
    callback?: (value: string | MultiValueType<SelectOption> | SingleValue<SelectOption>) => void;
    minLimit?: number;
    maxLimit?: number;
    chipsMaxToShow?: number;
    menuPlacement?: MenuPlacement;
};

export function SelectField<T>({
    input,
    meta,
    options,
    isClearable = true,
    isSearchable = true,
    isMulti = false,
    closeMenuOnSelect = true,
    hideSelectedOptions = false,
    isLoading = false,
    disabled = false,
    displayAllOptions = false,
    className,
    classNames,
    placeholder,
    callback,
    onInputChange,
    minLimit,
    maxLimit,
    menuPlacement,
    ...rest
}: SelectFieldProps<T>) {
    const errored = useMemo(() => meta.error && meta.touched, [meta.error, meta.touched]);

    const handleChange = useCallback(
        (option: MultiValueType<SelectOption> | SingleValue<SelectOption>) => {
            const value = isMulti ? option : (option as SelectOption<string>)?.value;

            input.onChange(value);
            callback?.(value);
        },
        [callback, input, isMulti],
    );

    const selectValue = useMemo(() => {
        if (isMulti) {
            return input.value;
        }

        return input.value !== null && input.value !== undefined ? options?.find((option: SelectOption) => option.value === input.value) || null : null;
    }, [isMulti, input, options]);

    const components = {
        ClearIndicator,
        DropdownIndicator,
        IndicatorSeparator: () => null,
        Option: OptionComponent,
        MultiValue,
        MultiValueRemove,
    };

    const isOptionDisabled = useCallback(
        (currentOption: SelectOption) => {
            if (currentOption.isDisabled) {
                return true;
            }

            if (!isMulti || (isMulti && !selectValue)) {
                return false;
            }

            const isSelected = (selectValue as SelectOption[]).find(({ value }) => currentOption.value === value);

            return Boolean((!isSelected && maxLimit && selectValue.length >= maxLimit) || (isSelected && minLimit && selectValue.length <= minLimit));
        },
        [isMulti, maxLimit, minLimit, selectValue],
    );

    return (
        <>
            <Select
                {...input}
                {...rest}
                className={cn('', { errored, 'show-all': displayAllOptions }, [className])}
                classNamePrefix='react-select'
                instanceId={useId()}
                isClearable={isClearable}
                isSearchable={isSearchable}
                options={options}
                isMulti={isMulti}
                onChange={handleChange}
                value={selectValue}
                onInputChange={onInputChange}
                components={components as any}
                classNames={classNames}
                onBlur={event => input.onBlur(event)}
                styles={styles as any}
                placeholder={placeholder === undefined ? t('choose-placeholder') : placeholder}
                closeMenuOnSelect={closeMenuOnSelect}
                hideSelectedOptions={hideSelectedOptions}
                isLoading={isLoading}
                isDisabled={disabled}
                isOptionDisabled={isOptionDisabled}
                menuPlacement={menuPlacement}
            />
            {errored && <FormHelperText error={true}>{meta.error || meta.submitError}</FormHelperText>}
        </>
    );
}

type AsyncSelectFieldProps<Option, IsMulti extends boolean, Group extends GroupBase<Option>> = Partial<AsyncProps<Option, IsMulti, Group>> & {
    className?: string;
    classNames?: string;
    placeholder?: string;
    errored?: boolean;
    errorText?: string;
    disabled?: boolean;
    hint?: string;
};
export function AsyncSelectField<Option, IsMulti extends boolean, Group extends GroupBase<Option>>({
    className,
    classNames,
    placeholder,
    errored,
    errorText,
    disabled,
    hint,
    ...reactAsyncSelectProps
}: AsyncSelectFieldProps<Option, IsMulti, Group>) {
    const components = {
        ClearIndicator,
        DropdownIndicator,
        IndicatorSeparator: () => null,
        OptionComponent,
        MultiValueRemove,
    };

    return (
        <>
            <AsyncSelect
                {...reactAsyncSelectProps}
                className={cn('', { errored }, [className])}
                classNamePrefix='react-select'
                instanceId={useId()}
                components={components as any}
                classNames={classNames}
                styles={styles as any}
                isDisabled={disabled}
                placeholder={placeholder === undefined ? t('choose-placeholder') : placeholder}
            />
            {errored && <FormHelperText error={true}>{errorText}</FormHelperText>}
            {!errored && hint && <FormHelperText>{hint}</FormHelperText>}
        </>
    );
}
