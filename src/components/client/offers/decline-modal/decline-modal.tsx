import React, { useCallback, useMemo, useRef } from 'react';
import { FormApi } from 'final-form';
import { useRouter } from 'next/router';
import { Field, Form } from 'react-final-form';
import { toast } from 'react-toastify';

import { OfferActionModal } from '@/components/common/offer-action-modal/offer-action-modal';
import { OfferStatusesEnum } from '@/enums/offer-statuses-enum';
import { DeclinationReasonsEnum } from '@/enums/declination-reasons-enum';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import {LabeledCheckboxInput} from '@/fields/checkbox-input';
import {TextField} from '@/fields/text-field';
import { useAppDispatch } from '@store';
import loadboardApi from '@store/api/loadboard-api';
import { usePartiallyUpdateOfferMutation } from '@store/api/order-offers';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { required } from '@validators';

import './decline-modal.scss';

const t = translateByNamespace('client:order-offers:decline-popup');
const cn = classname('decline-modal');

type FormState = {
    [DeclinationReasonsEnum.LowPrice]: boolean;
    [DeclinationReasonsEnum.LackOfCapacity]: boolean;
    [DeclinationReasonsEnum.InconvenientDates]: boolean;
    declineComment: string | null;
};

export default function DeclineModal() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [decline] = usePartiallyUpdateOfferMutation();
    const formRef = useRef<FormApi<FormState>>();

    const onCloseHandler = useCallback(async () => {
        const newQuery = {
            ...router.query,
            openDeclineOfferId: null,
        };

        await router.push(
            {
                pathname: router.pathname,
                query: newQuery,
            },
            {
                pathname: router.asPath.split('?')[0],
                query: newQuery,
            },
        );
    }, [router]);

    const declineOffer = useCallback(() => {
        if (formRef.current) {
            const { values } = formRef.current.getState();

            decline({
                publicOfferId: router.query.openDeclineOfferId as string,
                newOrderData: {
                    status: OfferStatusesEnum.DECLINED,
                    declineComment: values.declineComment,
                    declineReasons: Object.values(DeclinationReasonsEnum).filter(reason => values[reason]),
                },
            })
                .then(async () => {
                    await onCloseHandler();
                    dispatch(
                        loadboardApi.util.invalidateTags([
                            { type: 'Loadboard', id: 'LIST' },
                            { type: 'Loadboard', id: 'Statistic' },
                        ]),
                    );
                })
                .catch(() => {
                    toast.error(t('decline-error') as string);
                });
        }
    }, [decline, router.query.openDeclineOfferId, onCloseHandler, dispatch]);

    const handleSubmit = useCallback(() => {
        console.log();
    }, []);

    const description = useMemo(
        () => (
            <Form<FormState>
                initialValues={{
                    [DeclinationReasonsEnum.LowPrice]: false,
                    [DeclinationReasonsEnum.LackOfCapacity]: false,
                    [DeclinationReasonsEnum.InconvenientDates]: false,
                    declineComment: null,
                }}
                onSubmit={handleSubmit}
                render={({ handleSubmit, form }) => {
                    formRef.current = form;

                    return (
                        <form onSubmit={handleSubmit} className={cn('form')}>
                            <div className={cn('form-checkboxes')}>
                                <Field name={DeclinationReasonsEnum.LowPrice} label={t('low-price')} component={LabeledCheckboxInput} validate={required} />
                                <Field
                                    name={DeclinationReasonsEnum.LackOfCapacity}
                                    label={t('lack-of-capacity')}
                                    component={LabeledCheckboxInput}
                                    validate={required}
                                />
                                <Field
                                    name={DeclinationReasonsEnum.InconvenientDates}
                                    label={t('inconvenient-date')}
                                    component={LabeledCheckboxInput}
                                    validate={required}
                                />
                            </div>
                            <FormControl>
                                <InputLabel>{t('comment')}</InputLabel>
                                <Field component={TextField} name='declineComment' multiline={true} parse={value => value} />
                            </FormControl>
                        </form>
                    );
                }}
            />
        ),
        [handleSubmit],
    );

    return (
        <OfferActionModal type='decline' onClose={onCloseHandler} onAction={declineOffer} isOpen={!!router.query.openDeclineOfferId}>
            {description}
        </OfferActionModal>
    );
}
