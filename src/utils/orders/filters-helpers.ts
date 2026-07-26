import { OrderSortingDirection, OrderSortingName, SearchSubjectsEnum } from '@enums';
import { AdminOrdersFiltersValue, FormOrdersFilters, OrdersAminFiltersFromUrlParams, OrdersFiltersFromUrlParams, OrdersFiltersValue } from '@types';
import { getObjectWithoutEmptyFields } from '@utils';

const toArray = <T>(value?: T | T[]): T[] | undefined => (value ? (Array.isArray(value) ? value : [value]) : undefined);

export const getAllOrdersFiltersFromUrlParams = (filtersFromUrl: OrdersFiltersFromUrlParams): OrdersFiltersValue => {
    const { dispatchers, search, searchSubject, orderName, orderDirection, statisticsGroup, page, statisticsStatus, requestsOrderId, driverAccountId } =
        filtersFromUrl;

    const filterValues: OrdersFiltersValue = {
        page,
        search,
        searchSubject: searchSubject ?? SearchSubjectsEnum.ORDER_ID,
        orderName: orderName ?? OrderSortingName.CREATION_DATE,
        orderDirection: orderDirection ?? OrderSortingDirection.DESC,
        statisticsGroup,
        statisticsStatus: statisticsGroup ? undefined : statisticsStatus,
        requestsOrderId,
        dispatchers: toArray(dispatchers),
        driverAccountId: toArray(driverAccountId),
    };

    return getObjectWithoutEmptyFields(filterValues);
};

export const getAllAminOrdersFiltersFromUrlParams = (filtersFromUrl: OrdersAminFiltersFromUrlParams): AdminOrdersFiltersValue => {
    const { searchSubject, dispatchers, orderName, orderDirection, perPage, statisticsStatus, driverAccountId, ...rest } = filtersFromUrl;

    const filterValues: AdminOrdersFiltersValue = {
        searchSubject: searchSubject ?? SearchSubjectsEnum.ORDER_ID,
        orderName: orderName ?? OrderSortingName.CREATION_DATE,
        orderDirection: orderDirection ?? OrderSortingDirection.DESC,
        perPage: Number(perPage) ?? 50,
        dispatchers: toArray(dispatchers),
        driverAccountId: toArray(driverAccountId),
        statisticsStatus: toArray(statisticsStatus),
        ...rest,
    };

    return getObjectWithoutEmptyFields(filterValues);
};

export const getFormFiltersFromUrlParams = (filtersFromUrl: OrdersFiltersFromUrlParams): FormOrdersFilters => {
    const { dispatchers, search, orderName, orderDirection, searchSubject, page } = getAllOrdersFiltersFromUrlParams(filtersFromUrl);

    return getObjectWithoutEmptyFields({
        dispatchers,
        search,
        orderDirection,
        orderName,
        searchSubject,
        page,
    });
};
