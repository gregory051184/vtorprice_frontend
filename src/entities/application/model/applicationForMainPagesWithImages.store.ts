//Специальный эффект для получения минимально необходимого объёма заявок, нужно фильтрацию сделать через компоненты
import {applicationApi} from "@box/entities/application";
import {BuyOrSellDeals} from "@box/entities/deal/model";
import Router from "next/router";
import {AxiosError} from "axios";
import {createEffect, createStore} from "effector";
import {IRecyclableApplication} from "@box/entities/application/model/types";

const getAllApplicationsWithPaginationFx = createEffect<
    Parameters<typeof applicationApi.getAllApplicationsWithPagination>[0],
    {
        data: Awaited<ReturnType<typeof applicationApi.getAllApplicationsWithPagination>>["data"];
        page?: number;
    },
    AxiosError
>({
        handler: async (params) => {
            //Для передачи категории
            const router = Router
            if (router.asPath.split('?')[1]) {
                if (+router.asPath.split('?')[0].split('/')[router.asPath.split('?')[0].split('/').length - 1] > 0 &&
                    (+router.asPath.split('?')[0].split('/').length === 4 || +router.asPath.split('?')[0].split('/').length === 6)) {
                    params['category'] = router.asPath.split('?')[0].split('/')[router.asPath.split('?')[0].split('/').length - 1];
                }
                //Для передачи субкатегории
                if (+router.asPath.split('?')[0].split('/')[router.asPath.split('?')[0].split('/').length - 1] > 0 &&
                    (+router.asPath.split('?')[0].split('/').length === 5 || +router.asPath.split('?')[0].split('/').length === 7)) {
                    params['sub_category'] = router.asPath.split('?')[0].split('/')[router.asPath.split('?')[0].split('/').length - 1];
                }
            } else {
                if (+router.asPath.split('/')[router.asPath.split('/').length - 1] > 0 &&
                    (+router.asPath.split('/').length === 4 || +router.asPath.split('/').length === 6)) {
                    params['category'] = router.asPath.split('/')[router.asPath.split('/').length - 1];
                }
                //Для передачи субкатегории
                if (+router.asPath.split('/')[router.asPath.split('/').length - 1] > 0 &&
                    (+router.asPath.split('/').length === 5 || +router.asPath.split('/').length === 7)) {
                    params['sub_category'] = router.asPath.split('/')[router.asPath.split('/').length - 1];
                }
            }
            if (router.query['type']) {
                if (router.query['type'] === 'buy') {
                    params['deal_type'] = BuyOrSellDeals.BUY
                }
                if (router.query['type'] === 'sell') {
                    params['deal_type'] = BuyOrSellDeals.SELL
                }
            } else {
                if (router.asPath.split('/').includes('buy')) {
                    params['deal_type'] = BuyOrSellDeals.BUY
                }
                if (router.asPath.split('/').includes('sell')) {
                    params['deal_type'] = BuyOrSellDeals.SELL
                }
            }
            if (+router.asPath.split('/').includes('wastes')) {
                params['application_recyclable_status'] = 1
            }
            if (+router.asPath.split('/').includes('granule')) {
                params['application_recyclable_status'] = 2
            }
            const {data} = await applicationApi.getAllApplicationsWithPagination(params)
            return {
                data,
                page: params.page,
            };
        }
    }
)

const $applicationsForMain = createStore<Array<IRecyclableApplication>>([])
    //ДОБАВИЛ ДЛЯ ОТОБРАЖЕНИЯ ОБЪЯВЛЕНИЙ НА ПЕРВЫХ СТРАНИЦАХ
    .on(getAllApplicationsWithPaginationFx.doneData, (state, data) => {
        if (data.page && data.page > 1) {
            return [...state, ...data.data.results];
        }
        return data.data.results;
    })

export {
    getAllApplicationsWithPaginationFx,
    $applicationsForMain,
}