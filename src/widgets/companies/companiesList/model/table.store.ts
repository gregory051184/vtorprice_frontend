import {createGate} from 'effector-react';
import {
    sample, attach, merge
} from 'effector';
import {companyModel} from '@box/entities/company';
import {
    companiesListFiltersModel,
} from '@box/features/company';
import {createOrdering, createPagination} from '@box/shared/lib/factories';
import {dealsForOffersModel} from '@box/entities/generate-list-of-offers';
import {dealsForOffersFiltersModel} from '@box/features/generateListOfOffers';
import {getCompaniesForMainFiltersPageFx} from "@box/entities/company/model";
import {mainMenuCompaniesFilters} from "@box/features/company/filters/mainMenuCompaniesFilters";

const gate = createGate();
const companiesMainFiltersGate = createGate();
const ordering = createOrdering();


const orderingForOffers = createOrdering();

const paginationForOffers = createPagination(dealsForOffersModel.getDealForOffersFx, merge([
    gate.close,
    dealsForOffersFiltersModel.dealsForOffersFilters.$values

]));


const getCompaniesForOfferFx = attach({
    source: {
        filters: dealsForOffersFiltersModel.dealsForOffersFilters.$values,
        ordering: orderingForOffers.$ordering,
        page: paginationForOffers.$currentPage
    },
    mapParams: (_, {filters, page, ordering}) => {
        return {
            page,
            dealsByThisRecyclable: filters.dealsByThisRecyclable?.value,
            lastDealDate: filters.lastDealDate?.value,
            city: filters.city?.value.id,
            buyAppsByThisRecyclable: filters.buyAppsByThisRecyclable?.value,
            lastAppDate: filters.lastAppDate?.value,
            ordering: ordering || ''
        };
    },
    effect: dealsForOffersModel.getDealForOffersFx
});


const pagination = createPagination(companyModel.getCompaniesFx, merge([
    gate.close,
    companiesListFiltersModel.filters.$values
]));

const getCompaniesFx = attach({
    source: {
        filters: companiesListFiltersModel.filters.$values,
        ordering: ordering.$ordering,
        page: pagination.$currentPage
    },
    mapParams: (_, {filters, page, ordering}) => {
        const mappedAdvantages = filters.activity_types__advantages?.map((el) => el.value.id);
        //ДОБАВИЛ ДЛЯ ОТСЕВА ПО Переработчик, Покупатель, Поставщик
        const list = ['Переработчик', 'Покупатель', 'Поставщик']

        const middleWareActivityTypes = () => {
            //@ts-ignore
            if (list.includes(filters.activity_types__rec_col_types?.label)) {
                return filters.activity_types__rec_col_types?.value.id.toString()
            } else {
                return undefined
            }
        }
        const middleWareActivityTypesRecColTypes = () => {
            //@ts-ignore
            if (!list.includes(filters.activity_types__rec_col_types?.label)) {
                return filters.activity_types__rec_col_types?.value.id.toString()
            } else {
                return undefined
            }
        }

        return {
            page,
            activity_types: middleWareActivityTypes(),
            activity_types__rec_col_types: middleWareActivityTypesRecColTypes(),
            recyclables__recyclables: filters.recyclables__recyclables?.value.id.toString(),
            status: filters.status?.value as number,
            city: filters.city?.value.id,
            activity_types__advantages: mappedAdvantages,
            search: filters.search,
            ordering: ordering || '',
            city__region__district: filters?.district?.value?.id,
            city__region: filters?.region?.value?.id,
            rate: filters?.company_rating?.value ? filters?.company_rating?.value.toString() : "0",
        };
    },
    effect: companyModel.getCompaniesFx
});

const paginationForMainFilters = createPagination(getCompaniesForMainFiltersPageFx, merge([
    companiesMainFiltersGate.close,
    mainMenuCompaniesFilters.$values,
]));

const getCompaniesForMainFiltersPage = attach({
    source: {
        filters: mainMenuCompaniesFilters.$values,
        ordering: ordering.$ordering,
        page: paginationForMainFilters.$currentPage
    },
    mapParams: (_, {filters, page, ordering}) => {
        const mappedAdvantages = filters.activity_types__advantages?.map((el) => el.value.id);
        //ДОБАВИЛ ДЛЯ ОТСЕВА ПО Переработчик, Покупатель, Поставщик
        const list = ['Переработчик', 'Покупатель', 'Поставщик']

        const middleWareActivityTypes = () => {
            //@ts-ignore
            if (list.includes(filters.activity_types__rec_col_types?.label)) {
                return filters.activity_types__rec_col_types?.value.id.toString()
            } else {
                return undefined
            }
        }
        const middleWareActivityTypesRecColTypes = () => {
            //@ts-ignore
            if (!list.includes(filters.activity_types__rec_col_types?.label)) {
                return filters.activity_types__rec_col_types?.value.id.toString()
            } else {
                return undefined
            }
        }

        return {
            page,
            activity_types: middleWareActivityTypes(),
            period: filters?.period?.value,
            deal_type: filters?.deal_type_select?.value,
            activity_types__rec_col_types: middleWareActivityTypesRecColTypes(),
            recyclables__recyclables: filters.recyclables?.value.id.toString(),
            is_favorite: filters?.status?.value,
            status: filters?.companies_trust?.value as number,
            city: filters.city?.value.id,
            activity_types__advantages: mappedAdvantages,
            search: filters.search,
            ordering: ordering || '',
            city__region__district: filters?.district?.value?.id,
            city__region: filters?.region?.value?.id,
            with_nds: filters.nds?.value.toString(),
            rate: filters?.company_rating?.value ? filters?.company_rating?.value.toString() : "0",
            deals_count: filters?.company_deals_number,
            company_volume: filters?.company_volume,
            company_has_supply_contract: filters?.company_has_supply_contract?.value,
            is_jur_or_ip: filters?.is_jur_or_ip?.value,
            company_failed_deals: filters?.company_failed_deals?.value,
            company_has_applications: filters?.company_has_applications?.value,
        };
    },
    effect: getCompaniesForMainFiltersPageFx
});


sample({
    clock: [
        gate.open,
        dealsForOffersFiltersModel.dealsForOffersFilters.$values,
        paginationForOffers.loadMore,
        orderingForOffers.$ordering
    ],
    source: dealsForOffersFiltersModel.dealsForOffersFilters.$values,
    target: getCompaniesForOfferFx
});


sample({
    clock: [
        gate.open,
        companiesListFiltersModel.filters.$values,
        pagination.loadMore,
        ordering.$ordering
    ],
    source: companiesListFiltersModel.filters.$values,
    target: getCompaniesFx
});

sample({
    clock: [
        companiesMainFiltersGate.open,
        mainMenuCompaniesFilters.$values,
        paginationForMainFilters.loadMore,
        paginationForMainFilters.setPerPage,
        ordering.$ordering
    ],
    source: mainMenuCompaniesFilters.$values,
    target: getCompaniesForMainFiltersPage
});

export {
    getCompaniesFx,
    gate,
    ordering,
    pagination,
    getCompaniesForOfferFx,
    orderingForOffers,
    paginationForOffers,
    paginationForMainFilters,
    companiesMainFiltersGate
};




