import {
    createEffect, createStore, sample
} from 'effector';
import {createLoaderStore} from '@box/shared/lib/helpers';
import {recyclableCategoryApi} from "@box/entities/category/api/recyclableCategoryApi";
import {createGate} from "effector-react";
import {AxiosResponse} from "axios";
import {IRecyclableCategory} from "@box/entities/recyclable/model";


const gate = createGate();

const getRecyclablesCategoriesFx = createEffect<() => Promise<AxiosResponse<Array<IRecyclableCategory>>>>({
        //@ts-ignore
       handler: async () => {
           const {data} = await recyclableCategoryApi.getRecyclablesCategories()
           return data.results
       }
    }
)

const recyclablesApplicationsPricesLoading = createLoaderStore(false, getRecyclablesCategoriesFx);

// @ts-ignore
// eslint-disable-next-line
const $recyclablesCategory = createStore<Array<IRecyclableCategory>>([])
    //@ts-ignore
    .on(getRecyclablesCategoriesFx.doneData, (state, data) => {
        return data;
    })

sample({
    //@ts-ignore
    source: gate.open,
    target: getRecyclablesCategoriesFx,
});


export {
    getRecyclablesCategoriesFx,
    recyclablesApplicationsPricesLoading,
    $recyclablesCategory,
    gate
};

