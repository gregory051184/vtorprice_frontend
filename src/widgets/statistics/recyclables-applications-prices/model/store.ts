import {createGate} from 'effector-react';
import {
    sample, attach, merge
} from 'effector';
import {createPagination} from '@box/shared/lib/factories';
import {recyclablesApplicationsPricesModel} from '@box/entities/statistics'
import {
    recyclableApplicationPricesFilterModel
} from '@box/features/statistics/filters/recyclableApplicationPriceFilter';

const gate = createGate();

const pagination = createPagination(
    recyclablesApplicationsPricesModel.getRecyclablesApplicationsPricesFx,
    merge(
        [gate.close, recyclableApplicationPricesFilterModel.appFilters.$values]
    )
);



const getRecyclablesApplicationsPricesFx = attach({
    source: {
        filters: recyclableApplicationPricesFilterModel.appFilters.$values,
        page: pagination.$currentPage,
    },
    mapParams: (_, {filters, page}) => {

        return {
            application_recyclable_status: filters.application_recyclable_status?.value.toString(),
            category: filters.category?.value.id?.toString(),
            category__parent: filters.category__parent?.value.id?.toString(),
            applications__city: filters.applications__city?.value.id?.toString(),
            applications__urgency_type: filters.applications__urgency_type?.value,
            page,
            period: filters.period?.value,
            deal_type: filters.deal_type?.value,
        };
    },
    effect: recyclablesApplicationsPricesModel.getRecyclablesApplicationsPricesFx,
});


sample({
    clock: [
        gate.open,
        recyclableApplicationPricesFilterModel.appFilters.$values,
        pagination.loadMore
    ],
    source: recyclableApplicationPricesFilterModel.appFilters.$values,
    target: getRecyclablesApplicationsPricesFx
});


export {
    getRecyclablesApplicationsPricesFx,
    gate,
    pagination,
};