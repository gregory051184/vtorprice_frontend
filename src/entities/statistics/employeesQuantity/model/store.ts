import {
    createEffect, createStore
} from 'effector';
import {AxiosError} from 'axios/index';
import {employeesQuantityApi} from '../../api';
import {IEmployeesQuantityData} from './types';


const getEmployeesQuantityFx = createEffect<
    Parameters<typeof employeesQuantityApi.getEmployeesQuantity>[0]
    , {
    data: Awaited<ReturnType<typeof employeesQuantityApi.getEmployeesQuantity>>['data'],
    page?: number
}, AxiosError>({
    handler: async (params) => {
        const {data} = await employeesQuantityApi.getEmployeesQuantity(params);

        return {
            data,
            page: params.page
        };
    }
});

// @ts-ignore
// eslint-disable-next-line
const $employeesQuantity = createStore<IEmployeesQuantityData>(null)
    // @ts-ignore
    .on(getEmployeesQuantityFx.doneData, (state, data) => {
        if (data.page && data.page > 1) {
            return [
                state,
                data.data,
            ];
        }
        return data.data;
    })

export {
    getEmployeesQuantityFx,
    $employeesQuantity
};