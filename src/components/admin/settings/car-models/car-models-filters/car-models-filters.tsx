import React, { memo, useCallback, useMemo, useRef } from 'react';
import { debounce } from 'debounce';
import { FormApi } from 'final-form';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { Field, Form } from 'react-final-form';

import { FormControl, InputLabel, SelectField, TextField } from '@fields';
import { useEffectOnce } from '@hooks';
import { useAppDispatch, useAppSelector } from '@store';
import { carModelStatusesSelector, filterSearchCarMakersAction, filterSearchCarMakersSelector } from '@store/admin';
import { carModelsSettingsActions } from '@store/admin/car-models-settings/slice';
import { classname } from '@utils/classname';
import { FormValuesSpy } from '@utils/form';
import { getObjectWithoutEmptyFields } from '@utils/objects';

import './car-models-filters.scss';

const CAR_MODEL_STATUSES_LABELS: any = {
    active: 'Active',
    deleted: 'Deleted',
};

const cn = classname('car-models-filters');

type CarModelsFiltersProps = {
    onFiltersChange: () => void;
};

type CarModelsFiltersFormState = {
    modelName?: string;
    maker?: string;
    status?: string;
};

type CarModelsQueryParams = Partial<{
    modelName: string;
    makerId: string;
    status: string;
    orderName: string;
    orderDirection: string;
}>;

const getCarModelsQueryParams = (filtersObject: CarModelsFiltersFormState, prevFilters: ParsedUrlQuery): CarModelsQueryParams => {
    const queryParams: CarModelsQueryParams = {};

    Object.keys(filtersObject).forEach(key => {
        const filterKey = key as keyof CarModelsFiltersFormState;

        switch (filterKey) {
            case 'status': {
                queryParams.status = filtersObject.status;
                break;
            }
            case 'maker': {
                queryParams.makerId = filtersObject.maker;
                break;
            }
            case 'modelName': {
                queryParams.modelName = filtersObject.modelName;
                break;
            }
            default: {
                const _exhaustiveCheck: never = filterKey;
            }
        }
    });

    if (typeof prevFilters.orderName === 'string') {
        queryParams.orderName = prevFilters.orderName;
    }
    if (typeof prevFilters.orderDirection === 'string') {
        queryParams.orderDirection = prevFilters.orderDirection;
    }

    return getObjectWithoutEmptyFields(queryParams);
};

export const CarModelsFilters = memo(({ onFiltersChange }: CarModelsFiltersProps) => {
    const dispatch = useAppDispatch();
    const isFirstRenderRef = useRef(true);
    const formRef = useRef<FormApi<CarModelsFiltersFormState>>();
    const router = useRouter();

    const onChangeHandler = useCallback(
        (values: CarModelsFiltersFormState) => {
            if (isFirstRenderRef.current) {
                isFirstRenderRef.current = false;

                return;
            }

            dispatch(
                carModelsSettingsActions.setFilters({
                    page: 1,
                    modelName: values.modelName ?? null,
                    makerId: values?.maker ?? null,
                    status: values?.status ?? null,
                }),
            );

            router.replace({ pathname: router.pathname, query: getCarModelsQueryParams(values, router.query) });

            onFiltersChange();
        },
        [dispatch, router, onFiltersChange],
    );

    const onMakerInputChangeHandler = useMemo(() => {
        const fetchCarMakers = (value: string) => {
            dispatch(filterSearchCarMakersAction(value || null));
        };

        return debounce(fetchCarMakers, 300);
    }, [dispatch]);

    const filterSearchCarMakers = useAppSelector(filterSearchCarMakersSelector);
    const carMakersOptions = useMemo(
        () => (filterSearchCarMakers ? filterSearchCarMakers.map(({ id, name }) => ({ value: id, label: name })) : []),
        [filterSearchCarMakers],
    );

    const carModelStatuses = useAppSelector(carModelStatusesSelector);
    const carModelStatusesOptions = useMemo(
        () => (carModelStatuses ? carModelStatuses.map(option => ({ value: option, label: CAR_MODEL_STATUSES_LABELS[option] })) : []),
        [carModelStatuses],
    );

    const getInitialFormStateFromUrlParams = (): CarModelsFiltersFormState => {
        const { modelName, makerId, status } = router.query;
        const formState: CarModelsFiltersFormState = {};

        if (modelName && typeof modelName === 'string') {
            formState.modelName = modelName;
        }

        if (makerId && typeof makerId === 'string') {
            formState.maker = makerId;
        }

        if (carModelStatusesOptions && status && typeof status === 'string') {
            formState.status = status;
        }

        return formState;
    };

    useEffectOnce(() => {
        formRef.current?.initialize(getInitialFormStateFromUrlParams());
    });

    return (
        <Form<CarModelsFiltersFormState>
            onSubmit={onChangeHandler}
            subscription={{ values: true }}
            render={({ form, handleSubmit }) => {
                formRef.current = form;

                return (
                    <form className={cn()} onSubmit={handleSubmit}>
                        <FormValuesSpy onChange={onChangeHandler} debounceTime={300} />
                        <FormControl>
                            <InputLabel>Model Name</InputLabel>
                            <Field name='modelName' component={TextField} placeholder='Please input something' />
                        </FormControl>
                        <FormControl>
                            <InputLabel>Maker</InputLabel>
                            <Field
                                name='maker'
                                component={SelectField}
                                options={carMakersOptions}
                                callback={onMakerInputChangeHandler}
                                placeholder='Input something for search'
                            />
                        </FormControl>
                        <FormControl>
                            <InputLabel>Status</InputLabel>
                            <Field name='status' component={SelectField} options={carModelStatusesOptions} />
                        </FormControl>
                    </form>
                );
            }}
        />
    );
});

CarModelsFilters.displayName = 'CarModelsFilters';
