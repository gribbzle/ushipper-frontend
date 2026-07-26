import React, { memo } from 'react';
import { format, startOfDay } from 'date-fns';
import ReactDatePicker, { ReactDatePickerCustomHeaderProps, ReactDatePickerProps } from 'react-datepicker';
import { FieldRenderProps } from 'react-final-form';

import { FormHelperText } from '@/fields';
import { IconButton, Input } from '@components';
import { ArrowChevronLeftIcon, ArrowChevronRightIcon, CalendarIcon } from '@icons';
import { classname, translateByNamespace } from '@utils';

import 'react-datepicker/dist/react-datepicker.css';
import './datepicker.scss';

const headerClassName = classname('datepicker');
const inputClassName = classname('datepicker-input');
const t = translateByNamespace('common:field');

type DatePickerProps = Omit<ReactDatePickerProps, 'onChange'> & FieldRenderProps<string>;

export const DatePicker = ({ input, meta, placeholder = t('default-placeholder'), className, ...rest }: DatePickerProps) => {
    const error = meta.error && meta.touched;

    const DatePickerCustomHeader = memo(function DatePickerCustomHeader({ decreaseMonth, increaseMonth, date }: ReactDatePickerCustomHeaderProps) {
        return (
            <div className={headerClassName('header')}>
                <div className={headerClassName('current-date')}>
                    <span className={headerClassName('current-month')}>{date.getMonthName()}</span>
                    <span className={headerClassName('current-year')}>{date.getFullYear()}</span>
                </div>
                <div className={headerClassName('navigations')}>
                    <IconButton className={headerClassName('navigation')} Icon={ArrowChevronLeftIcon} onClick={decreaseMonth} />
                    <IconButton className={headerClassName('navigation')} Icon={ArrowChevronRightIcon} onClick={increaseMonth} />
                </div>
            </div>
        );
    });

    return (
        <>
            <ReactDatePicker
                className={headerClassName('label', { disabled: !!rest.disabled })}
                name={input.name}
                calendarClassName={headerClassName('', [className])}
                renderCustomHeader={props => <DatePickerCustomHeader {...props} />}
                customInput={<Input className={inputClassName({ error })} endAdornment={<CalendarIcon />} />}
                selected={input.value ? new Date(input.value) : null}
                onChange={date => {
                    const formattedDate = date ? format(startOfDay(date), "yyyy-MM-dd'T'HH:mm:ss") : null;

                    input.onChange(formattedDate);
                }}
                onBlur={event => input.onBlur(event)}
                shouldCloseOnSelect={true}
                calendarStartDay={1}
                useWeekdaysShort={true}
                showPopperArrow={false}
                placeholderText={placeholder}
                {...rest}
            />
            {error && <FormHelperText error={true}>{meta.error}</FormHelperText>}
        </>
    );
};
