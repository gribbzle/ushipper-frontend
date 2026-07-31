import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-final-form';

import { OrderVehiclesForm } from '@/components/client/orders/forms/order-vehicles-form/order-vehicles-form';
import { Button } from '@/components/common/button/button';
import { Paper } from '@/components/ui/surfaces/paper/paper';
import { useDisableProductChanging } from '@/hooks/order/use-disable-product-changing';
import { VehicleType } from '@enums';
import { PlusIcon } from '@icons';
import { OrderFieldsGroup } from '@store/client';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('client:order:vehicles');

type Props = {
    className?: string;
    counterVehicles?: number;
};

export const OrderVehiclesFormPaper = ({ className, counterVehicles = 0 }: Props) => {
    const form = useForm();
    const [vehiclesCount, setVehiclesCount] = useState<number>(0);

    useEffect(() => {
        setVehiclesCount(counterVehicles);
    }, [counterVehicles]);

    const isDisabled = useDisableProductChanging();

    const handleVehicleAdd = useCallback(() => {
        form.mutators.push(OrderFieldsGroup.VEHICLES, { type: VehicleType.OTHER });
        setVehiclesCount(prev => prev + 1);
    }, [form.mutators]);

    const handleVehicleDelete = useCallback(
        (index: number) => {
            const deletedVehicleId = form.getState().values[OrderFieldsGroup.VEHICLES][index]?.id;

            form.mutators.remove(OrderFieldsGroup.VEHICLES, index);
            setVehiclesCount(prev => prev - 1);

            if (deletedVehicleId) {
                form.batch(() => {
                    form.mutators.push('deletedVehicles', deletedVehicleId);
                });
            }
        },
        [form],
    );

    const addBtn = useMemo(
        () =>
            isDisabled ? null : (
                <Button size='medium' onClick={handleVehicleAdd} type='button'>
                    <PlusIcon /> {t('add-btn-label')}
                </Button>
            ),
        [handleVehicleAdd, isDisabled],
    );

    const vehiclesForm = useMemo(() => <OrderVehiclesForm handleVehicleDelete={handleVehicleDelete} />, [handleVehicleDelete]);

    return <Paper className={className} title={t('header')} counter={vehiclesCount} actions={addBtn} body={vehiclesForm} />;
};
