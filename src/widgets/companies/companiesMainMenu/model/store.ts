import { attach, merge, sample } from 'effector';
import { applicationModel } from '@box/entities/application';
import { createOrdering, createPagination } from '@box/shared/lib/factories';
import { $userApplicationlistType } from '@box/pages/profile/applications/list/model';
import {createGate} from "effector-react";
import {
    applyMainMenuCompaniesFilters,
    mainMenuCompaniesFilters
} from "@box/features/company/filters/mainMenuCompaniesFilters";

const gate = createGate();
const ordering = createOrdering();
const pagination = createPagination(applicationModel.getApplicationsFx, merge([
    gate.close,
    mainMenuCompaniesFilters.$values
]));

const getApplications = attach({
    source: {
        filters: mainMenuCompaniesFilters.$values,
        page: pagination.$currentPage,
        ordering: ordering.$ordering,
        size: pagination.$perPage
    },
    mapParams: (_, {
        filters, page, ordering, size
    }) => ({
        page,
        size,
        ordering,
        //ДОБАВИЛ
        //Убрал urgency_type по умолчанию т.к. мешал на бэкенде, всегда присылал 1
        urgency_type: filters.urgency_type_tab?.value || filters.urgency_type_select?.value,

        activity_types__rec_col_types: filters.activity_types__rec_col_types?.value.id.toString(),

        companies_trust: filters.companies_trust?.value,
        period: filters.period?.value,
        nds: filters.nds?.value,

        ...(filters.bale_weight__gte && {bale_weight__gte: +filters.bale_weight__gte}),
        ...(filters.bale_weight__lte && {bale_weight__lte: +filters.bale_weight__lte}),

        ...(filters.weediness__gte && {weediness__gte: +filters.weediness__gte}),
        ...(filters.weediness__lte && {weediness__lte: +filters.weediness__lte}),

        ...(filters.moisture__gte && {moisture__gte: +filters.moisture__gte}),
        ...(filters.moisture__lte && {moisture__lte: +filters.moisture__lte}),

        company_deals_number: filters.company_deals_number,
        company_activity_type: +filters.company_activity_type?.value,
        company_volume: filters.company_volume,
        company_failed_deals: filters.company_failed_deals?.value,
        company_has_applications: filters.company_has_applications?.value,
        company_has_supply_contract: filters.company_has_supply_contract?.value,
        owner_has_companies: filters.owner_has_companies?.value,
        is_jur_or_ip: filters.is_jur_or_ip?.value,

        company_rating: filters.company_rating?.value,

        //___________________________
        city: filters.city?.value.id,
        deal_type: filters.deal_type_select?.value,
        recyclables: filters.recyclables?.value.id,
        search: filters.search,
        ...(filters.total_weight__gte && {total_weight__gte: +filters.total_weight__gte}),
        ...(filters.total_weight__lte && {total_weight__lte: +filters.total_weight__lte}),
        ...(filters.price__lte && {price__lte: +filters.price__lte}),
        ...(filters.price__gte && {price__gte: +filters.price__gte}),
        ...(filters.status?.value && { status: +filters.status.value }),
        ...(filters.created_at.every((el) => el !== null)
            && { created_at__gte: filters.created_at[0] || undefined }
        ),
        ...(filters.created_at.every((el) => el !== null)
            && { created_at__lte: filters.created_at[1] || undefined }
        )
    }),
    effect: applicationModel.getApplicationsFx
})

const searchApplicationsValue = mainMenuCompaniesFilters.fields.search.$value
const resetApplicationsForm = mainMenuCompaniesFilters.reset

sample({
    clock: [
        gate.open,
        pagination.loadMore,
        pagination.setPerPage,
        searchApplicationsValue,
        applyMainMenuCompaniesFilters,
        resetApplicationsForm,
        ordering.setOrdering,
        $userApplicationlistType
    ],
    target: getApplications
})

export {
    ordering,
    pagination,
    gate
};

