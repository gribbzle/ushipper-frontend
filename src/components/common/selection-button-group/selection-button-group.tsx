import React from 'react';

import { SelectionButton } from '@/components/common/selection-button/selection-button';
import { classname } from '@utils/classname';

import './selection-button-group.scss';

export type SelectionButtonOption = {
    label: string;
    value: string;
};

type SelectionButtonGroupProps = {
    name: string;
    options: SelectionButtonOption[];
    onChange?: (value: string) => void;
    checkedValue?: string;
    disabled?: boolean;
};

const cn = classname('selection-button-group');

export const SelectionButtonGroup = ({ options, name, onChange, checkedValue, disabled = false }: SelectionButtonGroupProps) => {
    const renderSeparator = (isVisible: boolean) => <span className={cn('separator', { visible: isVisible })} />;

    return (
        <fieldset className={cn()}>
            <div className={cn('options-wrapper')}>
                {options.map(({ label, value }, index) => {
                    const shortenedOptionLabel = label.replace(/\s+/g, '');
                    const optionId = `selection-option-${shortenedOptionLabel}`;
                    const isLastOption = index === options.length - 1;
                    const isChecked = checkedValue === value;
                    const isNextChecked = index < options.length - 1 && options[index + 1].value === checkedValue;
                    const showSeparator = !isChecked && !isNextChecked && !isLastOption;

                    return (
                        <React.Fragment key={optionId}>
                            <SelectionButton
                                label={label}
                                value={value}
                                id={optionId}
                                name={name}
                                onChange={onChange}
                                checked={isChecked}
                                disabled={disabled}
                            />

                            {renderSeparator(showSeparator)}
                        </React.Fragment>
                    );
                })}
            </div>
        </fieldset>
    );
};
