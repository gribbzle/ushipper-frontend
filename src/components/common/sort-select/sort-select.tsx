import React, { useEffect, useId, useState } from 'react';
import { ActionMeta, components, default as ReactSelect, DropdownIndicatorProps, MultiValue, OptionProps, SingleValue } from 'react-select';

import { Divider } from '@/components';
import { OfferSortingName, OrderSortingDirection, OrderSortingName } from '@/enums';
import { ArrowDownIcon, CheckIcon } from '@icons';
import { classname } from '@utils';

import './sort-select.scss';

export type SortSelectValue = [SortSelectOption<'orderName'>, SortSelectOption<'orderDirection'>];

export type SortSelectOption<Group extends 'orderName' | 'orderDirection' = 'orderName' | 'orderDirection'> = {
    label: string;
    value: Group extends 'orderDirection' ? OrderSortingDirection : OrderSortingName | OfferSortingName | string;
    group: Group;
    labelForInput?: string;
};

export type SortSelectGroup<Group extends 'orderName' | 'orderDirection' = 'orderName' | 'orderDirection'> = {
    options: SortSelectOption<Group>[];
};

export type SortSelectOptions = [SortSelectGroup<'orderName'>, SortSelectGroup<'orderDirection'>];

type Props = {
    name?: string;
    className?: string;
    options: SortSelectOptions | [];
    search?: boolean;
    closeMenuOnSelect?: boolean;
    onChange?: (newValue: SortSelectValue) => void;
    onFocus?: () => void;
    value?: SortSelectValue | null;
    onBlur?: () => void;
};

const cn = classname('sort-select');

const isOrderNameOption = (option: SortSelectOption): option is SortSelectOption<'orderName'> => option.group === 'orderName';

const DropdownIndicator = (props: DropdownIndicatorProps<SortSelectOption, boolean, SortSelectGroup>) => {
    return (
        <components.DropdownIndicator {...props} className={cn('dropdown-icon')}>
            <ArrowDownIcon width={15} height={15} />
        </components.DropdownIndicator>
    );
};

const Option = ({ children, ...props }: OptionProps<SortSelectOption, boolean, SortSelectGroup>) => (
    <components.Option {...props} className={cn('select-option', { selected: props.isSelected })}>
        {props.isSelected && <CheckIcon width={16} height={16} />} {children}
    </components.Option>
);

export const SortSelect = (props: Props) => {
    const { className, options, onChange, name, value, closeMenuOnSelect = true } = props;
    const [uncontrolledSelectValue, setUncontrolledSelectValue] = useState<SortSelectValue | []>([]);

    const isControlled = !!value;
    const selectValue = isControlled ? value : uncontrolledSelectValue;

    useEffect(() => {
        if (!isControlled && options.length) {
            setUncontrolledSelectValue([options[0].options[0], options[1].options[0]]);
        }
    }, [isControlled, options]);

    const handleChange = (_newValue: MultiValue<SortSelectOption> | SingleValue<SortSelectOption>, { option }: ActionMeta<SortSelectOption>) => {
        if (!selectValue.length) {
            return;
        }

        if (option) {
            let newSortValue: SortSelectValue;

            if (isOrderNameOption(option)) {
                newSortValue = [option, selectValue[1]];
            } else {
                newSortValue = [selectValue[0], option as SortSelectOption<'orderDirection'>];
            }

            onChange?.(newSortValue);

            if (!isControlled) {
                setUncontrolledSelectValue(newSortValue);
            }
        }
    };

    return (
        <ReactSelect<SortSelectOption, boolean, SortSelectGroup>
            name={name}
            instanceId={useId()}
            onChange={handleChange}
            className={`${cn()} ${className}`}
            classNames={{
                menu: () => cn('dropdown-menu__wrap'),
                menuList: () => cn('dropdown-menu'),
                singleValue: () => cn('value'),
                input: () => cn('input'),
                control: props => cn('control', { disabled: props.isDisabled, 'menu-opened': props.menuIsOpen }),
                placeholder: () => cn('placeholder'),
                group: () => cn('group'),
                valueContainer: () => cn('value-container'),
            }}
            isSearchable={false}
            isClearable={false}
            options={options}
            isMulti={true}
            value={selectValue}
            hideSelectedOptions={false}
            closeMenuOnSelect={closeMenuOnSelect}
            components={{
                DropdownIndicator,
                MultiValue: props => <span>{props.data.labelForInput || props.data.label}</span>,
                Option,
                GroupHeading: () => <Divider className={cn('divider')} />,
                IndicatorSeparator: () => null,
            }}
        />
    );
};
