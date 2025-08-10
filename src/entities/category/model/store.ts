import {
    createEffect, createStore, sample
} from 'effector';
import {createLoaderStore} from '@box/shared/lib/helpers';
import {createGate} from "effector-react";
import {AxiosResponse} from "axios";
import {ICategoriesWithStatistics, IRecyclableCategory} from "@box/entities/recyclable/model";
import {recyclableCategoryApi} from "@box/entities/category";


const gate = createGate();
const categoriesWithStatisticsGate = createGate();

const getRecyclablesCategoriesFx = createEffect<() => Promise<AxiosResponse<Array<IRecyclableCategory>>>>({
        //@ts-ignore
        handler: async () => {
            const {data} = await recyclableCategoryApi.getRecyclablesCategories({size: 1000})
            return data.results
        }
    }
)

const categoriesWithStatisticsFx = createEffect<() => Promise<AxiosResponse<Array<ICategoriesWithStatistics>>>>({
    //@ts-ignore
    handler: async () => {
        const {data} = await recyclableCategoryApi.getCategoriesWithStatistics()
        return data
    }
})

const recyclablesApplicationsPricesLoading = createLoaderStore(false, getRecyclablesCategoriesFx);

// @ts-ignore
// eslint-disable-next-line
const $recyclablesCategory = createStore<Array<IRecyclableCategory>>([])
    //@ts-ignore
    .on(getRecyclablesCategoriesFx.doneData, (state, data) => {
        return data;
    })

// @ts-ignore
// eslint-disable-next-line
const $categoriesWithStatistics = createStore<Array<ICategoriesWithStatistics>>([])
    .on(categoriesWithStatisticsFx.doneData, (state, data) => data)

sample({
    //@ts-ignore
    source: gate.open,
    target: getRecyclablesCategoriesFx,
});

sample({
    source: categoriesWithStatisticsGate.open,
    target: categoriesWithStatisticsFx,
})




export {
    getRecyclablesCategoriesFx,
    recyclablesApplicationsPricesLoading,
    $recyclablesCategory,
    gate,
    $categoriesWithStatistics,
    categoriesWithStatisticsGate
};

