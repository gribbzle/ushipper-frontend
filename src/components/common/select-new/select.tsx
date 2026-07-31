import React, { useCallback, useId, useMemo } from 'react';
import VendorSelect, {
    ClearIndicatorProps,
    components,
    ControlProps,
    DropdownIndicatorProps,
    MultiValueRemoveProps,
    OnChangeValue,
    OptionProps,
    Props,
    SelectComponentsConfig,
} from 'react-select';

import { SelectOption } from '@/shared';
import { CSSObject } from '@emotion/serialize';
import { ArrowDownIcon, TickIcon, XCircleIcon } from '@icons';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

type SelectValue<T, isMulti extends boolean> = isMulti extends true ? T[] : T;

// todo: groups are not supported yet
// todo: did not test isMulti mode
export type SelectProps<T, isMulti extends boolean> = {
    value: SelectValue<T, isMulti> | null;
    isClearable?: boolean;
    isSearchable?: boolean;
    isMulti?: isMulti;
    closeMenuOnSelect?: boolean;
    hideSelectedOptions?: boolean;
    isLoading?: boolean;
    inputValue?: string;
    className?: string;
    disabled?: boolean;
    classNames?: Record<string, () => string>;
    loadOptions?: (s: string, cb: (options: SelectOption[]) => any) => any;
    options: SelectOption<T>[];
    onChange: (v: SelectValue<T, isMulti> | null) => void;
    onInputChange?: (searchString: string) => void;
    placeholder?: string;
    getValueOption?: (value: SelectValue<T, isMulti>) => SelectOption<T>;
    getOptionValue?: Props<SelectOption<T>, isMulti>['getOptionValue'];
    onFocus?: Props['onFocus'];
    onBlur?: Props['onBlur'];
    onMenuOpen?: Props['onMenuOpen'];
    onMenuClose?: Props['onMenuClose'];
    components?: SelectComponentsConfig<T, isMulti, any>;
    menuIsOpen?: boolean;
};

const styles = {
    control: (base: CSSObject, { menuIsOpen, isDisabled }: ControlProps) => ({
        ...base,
        backgroundColor: isDisabled ? 'var(--color-input-background-disabled)' : base.backgroundColor,
        boxShadow: 'none',
        minHeight: '40px',
        borderColor: `var(${menuIsOpen ? '--color-primary' : '--color-button-border-default'})`,
        '&:hover': {
            borderColor: `var(${menuIsOpen ? '--color-primary' : '--color-input-border-hover'})`,
        },
        fontSize: '14px',
        cursor: 'pointer',
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
    }),
    placeholder: (base: CSSObject) => ({
        ...base,
        overflow: 'hidden',
        whiteSpace: 'nowrap' as const,
        color: 'var(--color-input-placeholder)',
    }),
    input: (base: CSSObject) => ({
        ...base,
        color: 'var(--color-button-text-default)',
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

const DropdownIndicator = (props: DropdownIndicatorProps) => (
    <components.DropdownIndicator {...props}>
        <ArrowDownIcon width={12} height={12} />
    </components.DropdownIndicator>
);

const ClearIndicator = (props: ClearIndicatorProps<SelectOption>) => (
    <components.ClearIndicator {...props}>
        <XCircleIcon width={12} height={12} />
    </components.ClearIndicator>
);

const Option = (props: OptionProps<SelectOption>) => (
    <components.Option {...props}>
        {props.isSelected && <TickIcon width={16} height={16} />}
        {props.label}
    </components.Option>
);

const MultiValueRemove = (props: MultiValueRemoveProps<SelectOption>) => (
    <components.MultiValueRemove {...props}>
        <XCircleIcon width={12} height={12} />
    </components.MultiValueRemove>
);

const cn = classname('select');
const t = translateByNamespace('common:select-input');

const getValue = (value: unknown): unknown => {
    return value;
};

export default function Select<T, isMulti extends boolean>(props: SelectProps<T, isMulti>) {
    const id = useId();

    // todo: add value compare function
    const selectValue = useMemo(() => {
        if (props.isMulti) {
            const value = props.value as SelectProps<T, true>['value'];
            const formattedValues = value?.map(v => getValue(v));

            if (props.getValueOption) {
                // @ts-ignore
                return value ? value.map(v => props.getValueOption(v)) : null;
            }

            // todo: type guard is not working for multi for some reason
            return props.options.filter(o => formattedValues?.includes(getValue(o.value)));
        }

        if (props.getValueOption) {
            return props.value ? props.getValueOption(props.value) : null;
        }

        return props.options.find(o => getValue(o.value) === getValue(props.value as SelectValue<T, false>)) || null;
    }, [props.options, props.value, props.isMulti, props.getValueOption]);

    const onChange = useCallback(
        (event: OnChangeValue<SelectOption<T>, isMulti>) => {
            if (props.isMulti) {
                const value = event as SelectValue<SelectOption<T>, true>;

                props.onChange(value?.map(v => v.value) as any);
            } else {
                const value = event as SelectValue<SelectOption<T>, false>;

                props.onChange(value?.value as any);
            }
        },
        [props],
    );

    const { isClearable = true, components = {}, isSearchable = true, menuIsOpen } = props;

    return (
        <VendorSelect<SelectOption<T>, isMulti>
            className={cn('', [props.className])}
            classNamePrefix='react-select'
            instanceId={id}
            isClearable={isClearable}
            isSearchable={isSearchable}
            options={props.options}
            filterOption={null}
            isMulti={props.isMulti}
            onChange={onChange}
            inputValue={props.inputValue}
            value={selectValue}
            components={
                {
                    ClearIndicator: ClearIndicator,
                    DropdownIndicator: DropdownIndicator,
                    IndicatorSeparator: () => null,
                    Option: Option,
                    MultiValueRemove: MultiValueRemove,
                    ...components,
                } as any
            }
            classNames={props.classNames}
            styles={styles as any}
            placeholder={props.placeholder || t('choose-placeholder')}
            closeMenuOnSelect={props.closeMenuOnSelect}
            hideSelectedOptions={props.hideSelectedOptions}
            isLoading={props.isLoading}
            isDisabled={props.disabled}
            onInputChange={props.onInputChange}
            onMenuClose={props.onMenuClose}
            onMenuOpen={props.onMenuOpen}
            getOptionValue={props.getOptionValue}
            onFocus={props.onFocus}
            onBlur={props.onBlur}
            menuIsOpen={menuIsOpen}
        />
    );
}
