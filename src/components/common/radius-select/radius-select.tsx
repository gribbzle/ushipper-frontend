import React, { useCallback, useMemo, useRef, useState } from 'react';

import Select from '@/components/common/select-new/select';
import useOutsideCLick from '@/hooks/use-outside-cLick';
import { SelectOption } from '@/shared';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { CustomMenuList } from './custom-menu-list';

import './radius-select.scss';

const cn = classname('radius-select');
const t = translateByNamespace('common:units-of-measurement');

export const RADS = [25, 50, 75, 100, 300];

type Props = {
    value: number;
    onChange: (v: number | null) => void;
};

export default function RadiusSelect(props: Props) {
    const [customValue, setCustomValue] = useState<number | undefined>(props.value);

    const radiusOptions = useMemo<SelectOption<number>[]>(() => {
        const result = RADS.map(v => ({
            value: v,
            label: t('miles', { value: v }),
        }));

        if (customValue !== undefined && !RADS.includes(customValue)) {
            result.push({
                value: customValue,
                label: t('miles', { value: customValue }),
            });
        }

        return result;
    }, [customValue]);

    const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);

    const onChangeHandler = useCallback(
        (value: number | null) => {
            if (props.value === value) {
                props.onChange(null);
                setCustomValue(undefined);
            } else {
                props.onChange(value);
                setCustomValue(value ?? undefined);
            }

            setMenuIsOpen(false);
        },
        [props],
    );

    const onApplyCustomValueHandler = useCallback(
        (value: number) => {
            setCustomValue(value);
            props.onChange(value);
            setMenuIsOpen(false);
        },
        [props],
    );

    const ref = useRef<HTMLDivElement>(null);

    const clickOutsideHandler = useCallback(
        (outside: boolean) => {
            if (outside && menuIsOpen) {
                setMenuIsOpen(false);
            }
        },
        [menuIsOpen],
    );

    useOutsideCLick(ref, clickOutsideHandler);

    return (
        <div ref={ref}>
            <Select<number, false>
                value={props.value}
                isMulti={false}
                onChange={onChangeHandler}
                menuIsOpen={menuIsOpen}
                onMenuOpen={() => setMenuIsOpen(true)}
                isClearable={false}
                isSearchable={false}
                options={radiusOptions}
                className={cn()}
                classNames={{ menu: () => cn('menu') }}
                components={{
                    MenuList: props => <CustomMenuList {...props} value={customValue} onApply={onApplyCustomValueHandler} />,
                }}
            />
        </div>
    );
}
