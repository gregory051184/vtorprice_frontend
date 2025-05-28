import {attach, merge, sample} from 'effector';
import {applicationModel, urgencyTypeSelectValues} from '@box/entities/application';
import {createOrdering, createPagination} from '@box/shared/lib/factories';
import {$userApplicationlistType} from '@box/pages/profile/applications/list/model';
import {createGate} from "effector-react";
import {
    applicationFiltersForMainPageChart,
} from "@box/features/application/filters/applicationFiltersForMainPageChart";
import {getRecyclablesApplicationsForMainPageFx} from "@box/entities/statistics/mainPageStatistics/model";
import {
    applyMainMenuApplicationFilters
} from "@box/features/application/filters/mainMenuApplicationsFilters/model/store";
import {mainMenuApplicationFilters} from "@box/features/application/filters/mainMenuApplicationsFilters/model/store";
import {ITabSelectValue} from "@box/shared/ui";
import {getAllApplicationsWithPaginationFx} from "@box/entities/application/model";


const gate = createGate();


const forMainPageStatisticsGate = createGate();

const forRecyclablePageGate = createGate();

const ordering = createOrdering();
//@ts-ignore
const pagination = createPagination(applicationModel?.getApplicationsFx, merge([
    gate?.close,
    mainMenuApplicationFilters?.$values
]));

const mainPagePagination = createPagination(applicationModel.getApplicationsFx, merge([
    //forMainPageGate.close,
    gate?.close,
    applicationFiltersForMainPageChart.$values
]));

const getApplications = attach({
    source: {
        filters: mainMenuApplicationFilters.$values,
        urgency_type: mainMenuApplicationFilters.fields.urgency_type_select.$value.map((val) => val ? val.id : 2) ||
            mainMenuApplicationFilters.fields.urgency_type_tab.$value.map((val) => val ? val.id : 2),
        page: pagination.$currentPage,
        ordering: ordering.$ordering,
        size: pagination.$perPage
    },
    mapParams: (_, {
        filters, urgency_type, page, ordering, size
    }) => ({
        page,
        size,
        ordering,
        urgency_type,
        //ДОБАВИЛ

        activity_types__rec_col_types: filters.activity_types__rec_col_types?.value.id.toString(),
        companies_trust: filters.companies_trust?.value,
        application_recyclable_status: filters.application_recyclable_status?.value | filters.application_recyclable_status_tab?.value,
        period: filters?.period?.value,
        with_nds: filters.nds?.value,
        company_activity_type: +filters.company_activity_type?.value,
        ...(filters.bale_weight__gte && {bale_weight__gte: +filters.bale_weight__gte}),
        ...(filters.bale_weight__lte && {bale_weight__lte: +filters.bale_weight__lte}),

        ...(filters.weediness__gte && {weediness__gte: +filters.weediness__gte}),
        ...(filters.weediness__lte && {weediness__lte: +filters.weediness__lte}),

        ...(filters.moisture__gte && {moisture__gte: +filters.moisture__gte}),
        ...(filters.moisture__lte && {moisture__lte: +filters.moisture__lte}),

        //___________________________
        city: filters.city?.value.id,
        deal_type: filters.deal_type_select?.value,//filters.deal_type?.value,
        recyclables: filters.recyclables?.value.id,
        search: filters.search,
        ...(filters.total_weight__gte && {total_weight__gte: +filters.total_weight__gte}),
        ...(filters.total_weight__lte && {total_weight__lte: +filters.total_weight__lte}),
        ...(filters.price__lte && {price__lte: +filters.price__lte}),
        ...(filters.price__gte && {price__gte: +filters.price__gte}),
        ...(filters.status?.value && {status: +filters.status.value}),
        ...(filters.created_at.every((el) => el !== null)
            && {created_at__gte: filters.created_at[0] || undefined}
        ),
        ...(filters.created_at.every((el) => el !== null)
            && {created_at__lte: filters.created_at[1] || undefined}
        ),
        city__region: filters?.region?.value.id,
        city__region__district: filters?.district?.value?.id,
        company_rating: filters?.company_rating?.value,
    }),
    effect: applicationModel.getApplicationsFx
})


const getApplicationsForRecyclablePageFx = attach({
    source: {
        filters: applicationFiltersForMainPageChart.$values,
    },
    mapParams: (_, {filters}) => ({
        //page,
        period: filters.period_tab?.value,
        application_recyclable_status: +filters.application_recyclable_status?.value ?
            +filters.application_recyclable_status?.value : +filters.application_recyclable_status_tab?.value,
    }),
    effect: applicationModel.getApplicationsFx
})


/*const getApplicationsForMainPageFx = attach({
    source: {
        filters: applicationFiltersForMainPageChart.$values,
        page: mainPagePagination.$currentPage,
    },
    mapParams: (_, {filters, page}) => ({
        page,
        period: filters.period_tab?.value,
        application_recyclable_status: +filters.application_recyclable_status?.value ?
            +filters.application_recyclable_status?.value : +filters.application_recyclable_status_tab?.value,
    }),
    effect: applicationModel.getApplicationsFx
})*/


const getMainPageStatisticsFx = attach({
    source: {
        filters: applicationFiltersForMainPageChart.$values,
        page: mainPagePagination.$currentPage,
    },
    mapParams: (_, {filters}) => ({

        period: filters.period_tab?.value,
    }),
    effect: getRecyclablesApplicationsForMainPageFx
})

const searchApplicationsValue = mainMenuApplicationFilters.fields.search.$value//usersApplicationTableFilters.fields.search.$value;
const resetApplicationsForm = mainMenuApplicationFilters.reset//usersApplicationTableFilters.reset;

sample({
    clock: [
        gate.open,
        pagination.loadMore,
        pagination.setPerPage,
        searchApplicationsValue,
        applyMainMenuApplicationFilters,
        resetApplicationsForm,
        ordering.setOrdering,
        $userApplicationlistType
    ],
    target: getApplications
})


sample({
    clock: [
        forMainPageStatisticsGate.open,
        applicationFiltersForMainPageChart.$values
    ],
    source: applicationFiltersForMainPageChart.$values,
    target: getMainPageStatisticsFx
})

sample({
    clock: [forRecyclablePageGate.open, applicationFiltersForMainPageChart.$values],
    source: applicationFiltersForMainPageChart.$values,
    target: getApplicationsForRecyclablePageFx
})

export {
    forRecyclablePageGate,
    ordering,
    pagination,
    gate,
    forMainPageStatisticsGate,
    mainPagePagination,
};

