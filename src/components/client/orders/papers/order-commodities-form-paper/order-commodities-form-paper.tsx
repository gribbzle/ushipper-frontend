import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-final-form';

import { OrderCommoditiesForm } from '@/components/client/orders/forms/order-commodities-form/order-commodities-form';
import { Button } from '@/components/common/button/button';
import { Paper } from '@/components/common/paper/paper';
import { useDisableProductChanging } from '@/hooks/order/use-disable-product-changing';
import { PlusIcon } from '@icons';
import { OrderFieldsGroup } from '@store/client';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('client:order:commodities');

type Props = {
    className?: string;
    counterCommodities?: number;
};

export const OrderCommoditiesFormPaper = ({ className, counterCommodities = 0 }: Props) => {
    const form = useForm();
    const [commoditiesCount, setCommoditiesCount] = useState<number>(0);

    useEffect(() => {
        setCommoditiesCount(counterCommodities);
    }, [counterCommodities]);

    const isDisabled = useDisableProductChanging();

    const handleCommoditiesAdd = useCallback(() => {
        form.mutators.push(OrderFieldsGroup.COMMODITIES);
        setCommoditiesCount(prev => prev + 1);
    }, [form.mutators]);

    const handleCommodityDelete = useCallback(
        (index: number) => {
            const deletedCommoditiesId = form.getState().values[OrderFieldsGroup.COMMODITIES][index]?.publicId;

            form.mutators.remove(OrderFieldsGroup.COMMODITIES, index);
            setCommoditiesCount(prev => prev - 1);

            if (deletedCommoditiesId) {
                form.batch(() => {
                    form.mutators.push('deletedCommodities', deletedCommoditiesId);
                });
            }
        },
        [form],
    );

    const addBtn = useMemo(
        () =>
            isDisabled ? null : (
                <Button size='medium' onClick={handleCommoditiesAdd} type='button'>
                    <PlusIcon /> {t('add-btn-label')}
                </Button>
            ),
        [handleCommoditiesAdd, isDisabled],
    );

    const commoditiesForm = useMemo(() => <OrderCommoditiesForm handleCommodityDelete={handleCommodityDelete} />, [handleCommodityDelete]);

    return <Paper className={className} title={t('header')} counter={commoditiesCount} actions={addBtn} body={commoditiesForm} />;
};
