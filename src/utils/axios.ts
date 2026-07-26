import axios, { AxiosError } from 'axios';
import config from 'config';
import FormData from 'form-data';
import { camelKeys, snakeKeys } from 'js-convert-case';
import JsCookie from 'js-cookie';
import Router from 'next/router';
import { serialize } from 'object-to-formdata';

import { isServerSide } from './nextjs';

axios.interceptors.request.use(function (request) {
    const cookieToken = JsCookie.get('Authorization');
    const authorizationHeader = request.headers.Authorization;

    if (authorizationHeader) {
        if (typeof authorizationHeader === 'string' && !authorizationHeader.startsWith('Bearer ')) {
            request.headers.Authorization = `Bearer ${authorizationHeader}`;
        }
    } else if (cookieToken) {
        request.headers.Authorization = cookieToken;
    }

    if (isServerSide()) {
        request.baseURL = `http://localhost:${config.get('server.port')}/`;
    }

    request.headers.Accept = 'application/json';

    if (request.params) {
        request.params = snakeKeys(request.params, { recursive: true, recursiveInArray: true });
    }

    if (request.data && !(request.data instanceof FormData)) {
        request.data = snakeKeys(request.data, { recursive: true, recursiveInArray: true, keepTypesOnRecursion: isServerSide() ? [] : [File] });
    }

    if (request.headers['Content-Type'] === 'multipart/form-data' && !(request.data instanceof FormData)) {
        request.data = serialize(request.data, { booleansAsIntegers: true, noFilesWithArrayNotation: true, indices: true });
    }

    return request;
});

axios.interceptors.response.use(
    function (response) {
        if (response.data) {
            response.data = camelKeys(response.data, { recursive: true, recursiveInArray: true });
        }

        return response;
    },

    function (error: AxiosError<{ errors: Record<string, string[]>; message: string }, string>) {
        if (process.browser) {
            const isMapboxError = error?.config?.url?.includes('api.mapbox.com');

            if (error?.response?.status === 401) {
                if (isMapboxError) {
                    console.error('Ошибка авторизации Mapbox');
                } else {
                    JsCookie.remove('Authorization');
                    // Reload in order to run getServerSideProps and redirect
                    // a user to the appropriate page (see utils/auth.ts)
                    Router.reload();
                }
            }
        }

        if (error.status === 422 && error.response) {
            error.response.data.errors = camelKeys(error.response.data.errors, { recursive: true, recursiveInArray: true }) as Record<string, string[]>;
        }

        return Promise.reject(error);
    },
);

export default axios;
