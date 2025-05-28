import {IAuthUser} from '@box/entities/auth';
import Router from 'next/router';
import {AxiosError, AxiosResponse} from 'axios';
import {createEvent, createStore, createEffect} from 'effector';
import {$host, $authHost} from '@box/shared/api';
import Cookies from 'js-cookie';

interface IAuthStore {
    isAuth: boolean,
    user: IAuthUser | null
    access_token: string | null
}

const logoutEvent = createEffect({
    handler: async () => {
        Router.replace('/');
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        Cookies.remove('user_id');

    }
});

const getMeFx = createEffect<void, IAuthUser, AxiosError>({
    handler: async () => {
        const res: AxiosResponse = await $authHost.get('/users/');

        const wrong_data: any = res.data
        res.data['first_name'] = wrong_data['firstName']
        res.data['last_name'] = wrong_data['lastName']
        res.data['middle_name'] = wrong_data['middleName']

        return res.data;
    }
});

const getMeSsrFx = createEffect<string, IAuthUser, AxiosError>({
    handler: async (accessToken) => {
        const res: AxiosResponse = await $host.get('/users/', {
            headers: {
                Authorization: `JWT ${accessToken}`
            }
        })

        const wrong_data: any = res.data
        res.data['first_name'] = wrong_data['firstName']
        res.data['last_name'] = wrong_data['lastName']
        res.data['middle_name'] = wrong_data['middleName']

        return res.data
    }
});

const ssrAuthFx = createEffect<
    { access_token: string, refresh_token: string },
    { user: IAuthUser, access_token: string },
    AxiosError
>({
    handler: async ({access_token, refresh_token}) => {
        if (refresh_token && access_token && typeof window === 'undefined') {
            const data = await $host.get<IAuthUser>('/users/', {
                headers: {
                    Authorization: `JWT ${access_token}`
                }
            })

            const wrong_data: any = data.data
            data.data['first_name'] = wrong_data['firstName']
            data.data['last_name'] = wrong_data['lastName']
            data.data['middle_name'] = wrong_data['middleName']
            return {
                user: data.data,
                access_token
            };
        }
        throw new Error('no token provided');
    }
});

const setAuthUser = createEvent<{
    user: IAuthUser,
    access_token: string
}>();

const $authStore = createStore<IAuthStore>({
    isAuth: false,
    user: null,
    access_token: null,
}).on(setAuthUser, (state, {user, access_token}) => ({
    user: {
        ...state.user,
        ...user,
    },
    access_token,
    isAuth: true,
})).on(ssrAuthFx.done, (state, {result: {user, access_token}}) => ({
    user: {
        ...state.user,
        ...user,
    },
    access_token,
    isAuth: true
})).on(getMeFx.doneData, (state, user) => ({
    ...state,
    user: {
        ...state.user,
        ...user,
    },
}))
    .on(getMeSsrFx.doneData, (state, user) => ({
        ...state,
        user: {
            ...state.user,
            ...user,
        },

    }))
    .reset(logoutEvent);

const $usersCompany = $authStore.map((val) => val.user?.company);

export {
    $authStore,
    $usersCompany,
    logoutEvent,
    setAuthUser,
    ssrAuthFx,
    getMeFx,
    getMeSsrFx
};
