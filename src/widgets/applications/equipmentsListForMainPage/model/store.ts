import {attach, merge, sample} from 'effector';
import {createOrdering, createPagination} from '@box/shared/lib/factories';
import {$userApplicationlistType} from '@box/pages/profile/applications/list/model';
import {createGate} from "effector-react";
import {getEquipmentApplicationsFx} from "@box/entities/application/model";
import {
    applyMainMenuApplicationFilters,
} from "@box/features/application/filters/mainMenuApplicationsFilters/model/store";
import {mainMenuApplicationFilters} from "@box/features/application/filters/mainMenuApplicationsFilters/model/store";

const gateForEquipmentMainPage = createGate();


const orderingForEquipmentMainPage = createOrdering();
const paginationForEquipmentMainPage = createPagination(getEquipmentApplicationsFx, merge([
    gateForEquipmentMainPage.close,
    mainMenuApplicationFilters.$values
]));

const getEquipmentApplications = attach({
    source: {
        filters: mainMenuApplicationFilters.$values,
        page: paginationForEquipmentMainPage.$currentPage,
        ordering: orderingForEquipmentMainPage.$ordering,
        size: paginationForEquipmentMainPage.$perPage
    },
    mapParams: (_, {
        filters, page, ordering, size
    }) => ({
        page,
        size,
        ordering,
        equipment__category: filters?.equipment_category?.value.id,
        was_in_use: filters.was_in_use?.value,
        sale_by_part: filters.sale_by_part?.value,
        manufacture_date__gte: filters.manufacture_date[0]?.toLocaleDateString().split('.').reverse().join('-'),
        manufacture_date__lte: filters.manufacture_date[1] !== null ?
            filters.manufacture_date[1].toLocaleDateString().split('.').reverse().join('-') :
            filters.manufacture_date[0] !== null ? new Date().toLocaleDateString().split('.').reverse().join('-') : null,
        companies_trust: filters.companies_trust?.value,
        period: filters.period?.value,
        nds: filters.nds?.value,
        company_activity_type: +filters.company_activity_type?.value,
        city: filters.city?.value.id,
        deal_type: filters.deal_type_select?.value,//filters.deal_type?.value,
        search: filters.search,
        ...(filters.price__lte && {price__lte: +filters.price__lte}),
        ...(filters.price__gte && {price__gte: +filters.price__gte}),
        ...(filters.status?.value && {status: +filters.status.value}),
        created_at__gte: filters.created_at[0],
        created_at__lte: filters.created_at[1] !== null ?
            filters.created_at[1] : filters.created_at[0] !== null ? new Date() : null,
    }),
    effect: getEquipmentApplicationsFx
})

const searchApplicationsValue = mainMenuApplicationFilters.fields.search.$value//usersApplicationTableFilters.fields.search.$value;
const resetApplicationsForm = mainMenuApplicationFilters.reset//usersApplicationTableFilters.reset;

sample({
    clock: [
        gateForEquipmentMainPage.open,
        paginationForEquipmentMainPage.loadMore,
        paginationForEquipmentMainPage.setPerPage,
        searchApplicationsValue,
        applyMainMenuApplicationFilters,
        resetApplicationsForm,
        orderingForEquipmentMainPage.setOrdering,
        $userApplicationlistType
    ],
    target: getEquipmentApplications
})


export {
    orderingForEquipmentMainPage,
    paginationForEquipmentMainPage,
    gateForEquipmentMainPage,
};

