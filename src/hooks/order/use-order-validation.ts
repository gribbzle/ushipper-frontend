import { useEffect, useState } from 'react';
import Joi from 'joi';

import { DeliveryInformation, OrderCommodity, PaymentInformation, PickupInformation } from '@store/api/orders-api';
import { OrderVehicle } from '@/shared/types';
import { Load } from '@store/client';
import { translateByNamespace } from '@utils/i18n';
import { isFreightX, isUshipper } from '@utils/project-config';

const t = translateByNamespace('client:order:validation');
const vehicleSchema = Joi.array()
    .items(
        Joi.object<OrderVehicle>()
            .keys({
                make: Joi.string()
                    .required()
                    .messages({
                        'string.base': t('vehicle-make'),
                    }),
                model: Joi.string()
                    .required()
                    .messages({
                        'string.base': t('vehicle-model'),
                    }),
            })
            .unknown(true),
    )
    .min(1)
    .messages({
        'array.min': `${t('vehicle-model')}||${t('vehicle-make')}`,
    });

const commoditySchema = Joi.array()
    .items(
        Joi.object<OrderCommodity>()
            .keys({
                description: Joi.string()
                    .required()
                    .messages({
                        'string.base': t('commodity-description'),
                    }),
                quantity: Joi.number()
                    .required()
                    .messages({
                        'number.base': t('commodity-quantity'),
                    }),
            })
            .unknown(true),
    )
    .min(1)
    .messages({
        'array.min': `${t('commodity-description')}||${t('commodity-quantity')}`,
    });

const pickupInformationSchema = Joi.object<PickupInformation>({
    city: Joi.string()
        .required()
        .messages({
            'string.base': t('pickup-city'),
        }),
    scheduledPickupAt: Joi.date()
        .required()
        .messages({
            'date.base': t('pickup-date'),
        }),
}).unknown(true);

const deliveryInformationSchema = Joi.object<DeliveryInformation>({
    city: Joi.string()
        .required()
        .messages({
            'string.base': t('delivery-city'),
        }),
    scheduledDeliveryAt: Joi.date()
        .required()
        .messages({
            'date.base': t('delivery-date'),
        }),
}).unknown(true);

const paymentInformationSchema = Joi.object<PaymentInformation>({})
    .custom((value, helpers) => {
        const { payment, delayedPayment } = value;

        if (!payment && !delayedPayment) {
            return helpers.error('any.required');
        }

        return value;
    })
    .messages({
        'any.required': t('price'),
    })
    .unknown(true);

const orderValidationSchema = Joi.object<Load>({
    ...(isFreightX && { commodities: commoditySchema }),
    ...(isUshipper && { vehicles: vehicleSchema }),
    pickupInformation: pickupInformationSchema,
    deliveryInformation: deliveryInformationSchema,
    paymentInformation: paymentInformationSchema,
}).unknown(true);

export default function useOrderValidation(order: Load) {
    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        const { error } = orderValidationSchema.validate(order, {
            allowUnknown: false,
            abortEarly: false,
        });

        if (error?.details) {
            const messages: string[] = [];

            error.details.forEach(detail => {
                if (detail.message.includes('||')) {
                    const splited = detail.message.split('||');

                    messages.push(splited[0]);
                    messages.push(splited[1]);
                } else {
                    messages.push(detail.message);
                }
            });
            setErrors(messages);
        }
    }, [order]);

    return {
        errors,
    };
}
