import React, { useMemo } from 'react';

import { InspectionItem as InspectionItemType, InspectionItems as InspectionItemsType } from '@store/client/order-BOL';
import { DotLeader } from '@ui';
import { classname, translateByNamespace } from '@utils';

import './inspection-items.scss';

const cn = classname('inspection-items');
const t = translateByNamespace('client:order:inspection');

interface InspectionItemsProps {
    odometer: number | null;
    notes: string | null;
    items: InspectionItemsType;
}

export const InspectionItems = ({ odometer, notes, items }: InspectionItemsProps) => {
    const odometerItem = useMemo(
        () =>
            odometer ? (
                <InspectionItem name={t('odometer')} item={t('odometer-value', { value: odometer.toLocaleString('en-US') })} />
            ) : (
                <span className={cn('item-name')}>{t('no-odometer')}</span>
            ),
        [odometer],
    );

    const InspectionItemsMap: Record<keyof InspectionItemsType, string> = {
        cargoCover: t('cargo-cover'),
        drivable: t('drivable'),
        glasses: t('glasses'),
        headphones: t('headphones'),
        headrests: t('headrests'),
        keys: t('keys'),
        manuals: t('manuals'),
        navigationDisk: t('navigationDisk'),
        pluginChargerCable: t('pluginChargerCable'),
        radio: t('radio'),
        remotes: t('remotes'),
        spareTire: t('spareTire'),
        title: t('title'),
        windscreen: t('windscreen'),
    };

    return (
        <div className={cn()}>
            <p className={cn('notes')}>{notes ? notes : t('no-inspection-notes')}</p>
            {odometerItem}
            {Object.keys(items).map(key => {
                const itemKey = key as keyof typeof items;

                return <InspectionItem key={itemKey} name={InspectionItemsMap[itemKey]} item={items[itemKey]} />;
            })}
        </div>
    );
};

interface InspectionItemProps {
    item: InspectionItemType;
    name: string;
}

const InspectionItem = ({ item, name }: InspectionItemProps) => {
    const value: string | number = useMemo(() => {
        if (item === null) {
            return t('n/a');
        }
        if (typeof item === 'boolean') {
            return Number(item);
        }

        return item;
    }, [item]);

    return <DotLeader label={name} value={value} />;
};
