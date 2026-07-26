// TO DO: remove all ts-ignore

import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';

export enum RequestStatus {
    NONE = 'none',
    PROCESSING = 'PROCESSING',
    SUCCESS = 'success',
    ERROR = 'error',
}

export enum RequestErrorCode {
    NOT_FOUND = 404,
    UNPROCESSABLE_ENTITY = 422,
    INTERNAL_SERVER_ERROR = 500,
    GATEWAY_TIMEOUT = 504,
}

export type PaginatedRequest = {
    page: number;
    perPage: number;
};

//deprecated TODO remove
export type PaginatedData<D> = {
    currentPage: number;
    data: D;
    firstPageUrl: string;
    from: number;
    lastPage: number;
    lastPageUrl: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    nextPageUrl: string | null;
    path: string;
    perPage: number;
    prevPageUrl: string | null;
    to: number;
    total: number;
};
export type PaginatedResponse<D> = {
    data: D;
    meta: {
        firstPageUrl: string;
        from: number;
        lastPage: number;
        lastPageUrl: string;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        nextPageUrl: string | null;
        path: string;
        perPage: number;
        prevPageUrl: string | null;
        to: number;
        total: number;
        currentPage: number;
    };
    links: {
        first: string | null;
        last: string | null;
        next: string | null;
        prev: string | null;
    };
};

export type Response<D = null> = {
    data: D | null;
    message?: string;
};

export type CursorPagination<D = []> = {
    data: D;
    links: {
        first: string;
        last: string;
        next: string | null;
        prev: string | null;
    };
    meta: {
        nextCursor: string | null;
        path: string;
        perPage: number;
        prevCursor: string | null;
    };
};

export type RequestWithStatus<D = null> = {
    status: RequestStatus;
    error: any | null;
    data: D | null;
    errorCode: number | null;
    wasCalled: boolean;
};

const requestPending = (wasCalled: boolean | undefined = false): RequestWithStatus => ({
    status: RequestStatus.PROCESSING,
    error: null,
    data: null,
    errorCode: null,
    wasCalled,
});

const requestSuccess = <D>(data: D): RequestWithStatus<D> => ({
    status: RequestStatus.SUCCESS,
    error: null,
    data,
    errorCode: null,
    wasCalled: true,
});

const requestFailed = (error: any, errorCode: number): RequestWithStatus => ({
    status: RequestStatus.ERROR,
    error,
    errorCode,
    data: null,
    wasCalled: true,
});

export const requestInitial = <D = null>(): RequestWithStatus<D> => ({
    status: RequestStatus.NONE,
    error: null,
    data: null,
    errorCode: null,
    wasCalled: false,
});

export const addAsyncThunkHandlers = <A, B, C>(builder: ActionReducerMapBuilder<A>, getPosts: ReturnType<typeof createAsyncThunk<B, C>>) => {
    const actionName = getPosts.typePrefix.split('/')[1];

    return builder
        .addCase(getPosts.pending.type, <S>(state: S) => {
            // @ts-ignore
            state[actionName] = requestPending(state[actionName]?.wasCalled);
        })
        .addCase(getPosts.fulfilled.type, <S, A>(state: S, action: A) => {
            // @ts-ignore
            state[actionName] = requestSuccess(action.payload);
        })
        .addCase(getPosts.rejected.type, <S, A>(state: S, action: A) => {
            // @ts-ignore
            state[actionName] = requestFailed(action.payload.response.data, action.payload.response.status);
        });
};

export const composeBuilder = <A>(builder: ActionReducerMapBuilder<A>, funcs: Array<ReturnType<typeof createAsyncThunk<any, any>>>) => {
    let result = builder;

    funcs.forEach(func => {
        result = addAsyncThunkHandlers(result, func);
    });

    return result;
};
