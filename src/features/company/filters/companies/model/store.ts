import {createForm} from '@box/shared/effector-forms';
import {
    createEffect, createEvent, createStore, sample
} from 'effector';
import {IPillValue, ISelectValue} from '@box/shared/ui';
import {companyModel, companyApi, companyStatusSelectValues} from '@box/entities/company';
import {cityModel} from '@box/entities/city';
import {IActivityTypeAdvantage} from '@box/entities/company/model';
import {AxiosError} from 'axios';
import {IDistrict} from "@box/entities/district";
import {IRegion} from "@box/entities/region/model";
import {IUser} from "@box/entities/user";
import {IManager} from "@box/entities/user/ui/types";

const getActivityTypeAdvantagesFx = createEffect<
    number,
    Array<IActivityTypeAdvantage>,
    AxiosError
>(async (activity) => {
    const {data} = await companyApi.getActivityTypeAdvantages(activity);
    return data.results;
});

const setAllAdvantages = createEvent<Array<IActivityTypeAdvantage>>();
const $allAdvantages = createStore<Array<IActivityTypeAdvantage>>([])
    .on(getActivityTypeAdvantagesFx.doneData, (_, data) => data)
    .on(setAllAdvantages, (_, data) => data);

const filters = createForm({
    fields: {
        search: {
            init: ''
        },
        activity_types__rec_col_types: {
            init: null as ISelectValue<companyModel.IRecColType> | null
        },
        //ДОБАВИЛ ДЛЯ СОРТИРОВКИ ПО ПЕРЕРАБОТЧИКУ/ПОКУПАТЕЛЮ/СБОРЩИКУ
        activity_types: {
            init: null as ISelectValue<companyModel.IRecColType> | null
        },

        activity_types__advantages: {
            init: [] as Array<IPillValue<IActivityTypeAdvantage>>
        },
        recyclables__recyclables: {
            init: null as ISelectValue<companyModel.ICompanyRecyclable['recyclables']> | null
        },

        status: {
            init: {
                id: 13,
                label: 'Все компании',
                value: null
            } as ISelectValue<number | null> | null
        },
        exist_company_recyclables: {
            init: {
                id: 6,
                label: 'Не обязательно',
                value: null
            } as ISelectValue<number | null> | null
        },
        city: {
            init: null as ISelectValue<cityModel.ICity> | null
        },
        region: {
            init: null as ISelectValue<IRegion> | null
        },
        district: {
            init: null as ISelectValue<IDistrict> | null
        },
        company_rating: {
            init: {
                id: 10,
                label: 'Любой',
                value: 0,
            } as ISelectValue<number | null> | null
        },

        manager: {
            init: null as ISelectValue<IUser> | null
        }
    },
});

sample({
    source: filters.fields.activity_types__rec_col_types.$value,
    filter: (src) => src !== null,
    fn: (source) => source?.value.id || 0,
    target: getActivityTypeAdvantagesFx
});

sample({
    source: filters.fields.activity_types__rec_col_types.$value,
    filter: (src) => src === null,
    target: [
        filters.fields.activity_types__advantages.set.prepend(() => []),
        setAllAdvantages.prepend(() => [])
    ]
});

export {
    filters,
    $allAdvantages
};
