import {createGate} from "effector-react";
import {createPagination} from "@box/shared/lib/factories";
import {attach, merge, sample} from "effector";
import {applicationFiltersForMainPageChart} from "@box/features/application/filters/applicationFiltersForMainPageChart";
import {getAllApplicationsWithPaginationFx} from "@box/entities/application/model";

const forMainPageGate = createGate();

const forMainPagePagination = createPagination(getAllApplicationsWithPaginationFx, merge([
    forMainPageGate?.close,
    applicationFiltersForMainPageChart.$values,
]))

//ДОБАВИЛ ДЛЯ ОБЪЯВЛЕНИЙ НА ПЕРВЫХ СТРАНИЦАХ
const getAllApplicationsWithPagination = attach({
    source: {
        filters: applicationFiltersForMainPageChart.$values,
        page: forMainPagePagination.$currentPage,
        size: forMainPagePagination.$perPage
    },
    mapParams: (_, {filters, page, size}) => ({
        page,
        size,
        period: filters.period_tab?.value,
    }),
    effect: getAllApplicationsWithPaginationFx
})

sample({
    clock: [
        forMainPageGate.open,
        applicationFiltersForMainPageChart.$values,
        forMainPagePagination.loadMore,
        forMainPagePagination.setPerPage,
    ],
    source: applicationFiltersForMainPageChart.$values,
    target: getAllApplicationsWithPagination
})

export {
    forMainPageGate,
    forMainPagePagination,
}